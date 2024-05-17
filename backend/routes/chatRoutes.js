require("dotenv").config();
const sequelize = require("../config/database");
const User = require("../models/User");
const pusher = require("../config/pusher");
const Chat_room = require("../models/Chat_room");
const Message = require("../models/Message");
const User_ChatRoom = require("../models/User_ChatRoom");
const { Op } = require("sequelize");

module.exports.createChatRoom = async (req, res) => {
  try {
    const user = req.currentUser;

    const transaction = await sequelize.transaction();
    const receiverId = req.body;
    const chat_room = await Chat_room.create({}, { transaction });
    await User_ChatRoom.create(
      {
        userId: user.id,
        chat_roomId: chat_room.id,
      },
      { transaction }
    );
    await User_ChatRoom.create(
      {
        userId: receiverId,
        chat_roomId: chat_room.id,
      },
      { transaction }
    );
    await transaction.commit();
    res.send(chat_room);
  } catch (err) {
    res.send(err);
  }
};

module.exports.getChatRooms = async (req, res) => {
  try {
    const user = req.currentUser;

    const user_chatRooms = await User_ChatRoom.findAll({
      where: {
        userId: user.id,
      },
    });

    const chat_rooms = [];
    for (let i = 0; i < user_chatRooms.length; i++) {
      const chat_room = await Chat_room.findOne({
        where: {
          id: user_chatRooms[i].chatRoomId,
        },
        include: [
          {
            model: User,
            where: {
              id: { [Op.not]: user.id },
            },
          },
          {
            model: Message,
            limit: 1,
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: User,
                attributes: ["id", "username"],
              },
            ],
          },
        ],
      });
      chat_rooms.push(chat_room);
    }

    res.send(chat_rooms);
  } catch (err) {
    res.send(err);
  }
};

module.exports.getMessagesInRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user_chatRooms = await User_ChatRoom.findAll({
      where: {
        userId: req.currentUser.id,
        chat_roomId: roomId,
      },
    });

    if (user_chatRooms.length === 0) {
      return res.status(401).send({ message: "unauthorized" });
    }

    const messages = await Chat_room.findOne({
      where: {
        roomId: roomId,
      },
    });
    res.send(messages);
  } catch (err) {
    res.send(err);
  }
};

module.exports.getRoomByUser = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    
    // Check if there is a room between the two users, if not create one
    let room;

    // Find existing chat rooms between the two users
    const user_chatRooms = await User_ChatRoom.findAll({
      where: {
        [Op.or]: [{ userId: currentUser.id }, { userId: id }],
      },
    });

    let room_ids = user_chatRooms.map((room) => room.chatRoomId);
    // get any id that is repeated twice
    let repeated_id = null;
    room_ids.forEach((id) => {
      if (room_ids.filter((x) => x === id).length > 1) {
        repeated_id = id;
      }
    });
    let room_id;
    // If there's no existing chat room, create a new one
    if (repeated_id === null) {
      const transaction = await sequelize.transaction();

      room = await Chat_room.create({}, { transaction });
      // for user 1
      await User_ChatRoom.create(
        { userId: currentUser.id, chatRoomId: room.id },
        { transaction }
      );
      // for user 2
      await User_ChatRoom.create(
        { userId: id, chatRoomId: room.id },
        { transaction }
      );


      await transaction.commit();
      return res.status(200).json({ success: true, room, user });
    } else {
      room_id = repeated_id;
    }
    room = await Chat_room.findOne({
      where: {
        id: room_id,
      },
    });
    return res.status(200).json({ success: true, room, user });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.sendMessage = async (req, res) => {
  try {
    const requestUser = req.currentUser;
    const user = await User.findOne({
      where: {
        id: requestUser.id,
      },
    });
    if (!user) {
      return res.status(401).send({ message: "unauthorized" });
    }
    const { roomId, message } = req.body;
    const chat_room = await Chat_room.findOne({
      where: {
        id: roomId,
      },
    });
    if (!chat_room) {
      return res.status(404).send({ message: "chat room not found" });
    }
    const transaction = await sequelize.transaction();
    await chat_room.createMessage(
      {
        Content: message,
        senderId: user.id,
      },
      { transaction }
    );
    await transaction.commit();
    pusher.trigger(`chat-room-${roomId}`, "new-message", {
      message: message,
    });
    res.send({ message: "message sent" });
  } catch (err) {
    res.send(err);
  }
};
