import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import * as api from "../api/index";
import "../assets/css/chat.css";
import PageTitle from "../components/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
import pusher from "../api/pusher";

export function Chat() {
  const navigate = useNavigate();

  const { roomId } = useParams();
  const allRooms = useRef({});
  const [currentMessages, setCurrentMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState({});

  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    setRoomsLoading(true);
    if (!currentUser) {
      setRoomsLoading(false);
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await api.getChatRooms(currentUser.id);
        setChatRooms(response.data);
        setRoomsLoading(false);
      } catch (error) {
        // window.location.href = "/login";
        setRoomsLoading(false);
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
  
  useEffect(() => {
    var channel = pusher.subscribe(`chat_room_${currentUser.id}`);
    channel.bind("new_message", function (data) {
      allRooms[data.chatRoomId].messages.unshift(data.dataValues);
      setChatRooms((prev) => {
        const index = prev.findIndex((room) => room.id === data.chatRoomId);
        if (index === -1) {
          let temp = {
            id: data.chatRoomId,
            user: [data.sender],
            messages: [data.message],
          };
          allRooms[data.chatRoomId] = temp;
          return [temp, ...prev];
        }
        prev[index].Messages.unshift(data.dataValues);
        const temp = prev[index];
        prev.splice(index, 1);
        prev.unshift(temp);
        return [...prev];
      });
      setCurrentMessages((prev) => {
        if (prev[0].id === data.dataValues.id) {
          return [...prev];
        }
        if (prev[0].chatRoomId === data.chatRoomId) {
          if (data.dataValues.senderId !== currentUser.id)
          return [data.dataValues, ...prev];
        else
          prev[0].id = data.dataValues.id;
          return [...prev];
        }
        return [...prev];
      });
    });
  }, []);

  useEffect(() => {
    if (!roomId) {
      setMessageLoading(false);
      return;
    }
    if (allRooms[roomId]) {
      setCurrentMessages(allRooms[roomId].messages);
      setMessageLoading(false);
      return;
    }
    const fetchRoomByUser = async () => {
      try {
        const response = await api.getRoomById(roomId);
        setCurrentRoom({
          ...response.data,
          user: response.data.user,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoomByUser();
  }, [roomId]);

  useEffect(() => {
    if (!currentRoom || !currentRoom.room) {
      setMessageLoading(false);
      return;
    }
    if (allRooms[currentRoom.room.id]) {
      setCurrentMessages(allRooms[currentRoom.room.id].messages);
      setMessageLoading(false);
      return;
    }
    const fetchMessages = async () => {
      try {
        const response = await api.getMessagesInRoom(currentRoom.room.id);
        let reversedMessages = response.data.reverse();
        setCurrentMessages(reversedMessages);
        allRooms[currentRoom.room.id] = {
          id: currentRoom.room.id,
          user: currentRoom.user,
          messages: reversedMessages,
        };

        setMessageLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [currentRoom]);

  const handleChatRoomChange = (room) => {
    setMessageLoading(true);
    navigate(`/chat/${room.id}`);
  };

  const handleSendMessage = async () => {
    if (!message) return;
    const newMessage = {
      content: message,
      senderId: currentUser.id,
      roomId: currentRoom.room.id,
      createdAt: "just now",
      chatRoomId: currentRoom.room.id,
    };
    setCurrentMessages([newMessage, ...currentMessages]);
    setMessage("");
    const response = await api.sendMessage({
      roomId: currentRoom.room.id,
      message,
    });
    if (response.data.success) {
      allRooms[currentRoom.room.id].messages.unshift(response.data.message);
      // update the currentMessages last message id
      setCurrentMessages((prev) => {
        prev[0].id = response.data.id;
        return [...prev];
      });
    }
  };

  const formatDate = (date) => {
    let d;
    d = new Date(date);

    if (d == "Invalid Date") {
      return date;
    }
    if (d < new Date()) {
      return d.toLocaleTimeString({}, { hour: "2-digit", minute: "2-digit" });
    } else {
      return d.toLocaleDateString();
    }
  };
  return (
    <>
      <Navbar showMobileNavbar={false} />
      <div className="p-lg-3 p-0 bg-white">
        <div
          id="main-container"
          className="d-flex flex-row align-items-start justify-content-center gap-3 px-lg-5 p-0 w-100"
        >
          <div
            id="chat-rooms"
            className="d-flex flex-column justify-content-start border rounded shadow py-3 h-100"
            style={{ width: "600px" }}
          >
            <span className="h4 border-bottom border-4 border-secondary mb-4 px-3 text-center">
              Your contacts
            </span>
            <div
              id="chat-rooms-list"
              className="d-flex flex-column gap-2 position-relative w-100 overflow-auto"
            >
              {roomsLoading ? (
                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                  <i className=" h1 fa-solid fa-ghost fa-spin text-secondary"></i>
                </div>
              ) : (
                <>
                  {chatRooms.length === 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                      <i className=" h1 fa-solid fa-ghost text-secondary"></i>
                      No contacts
                    </div>
                  ) : (
                    chatRooms.map((room) => (
                      <div key={room.id}>
                        <div
                          className="room py-3 active"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleChatRoomChange(room)}
                        >
                          <div className="d-flex flex-row align-items-start gap-2 px-3">
                            <div>
                              <img
                                src={
                                  room.Users[0].profilePicture ||
                                  "https://res.cloudinary.com/djwhrh0w7/image/upload/c_fill,w_100,h_100/v1716060482/profile_uakprb.png"
                                }
                                alt="avatar"
                                className="rounded-circle border border-2 border-primary object-fit-cover"
                                style={{ width: "50px", height: "50px" }}
                              />
                            </div>
                            <div className="w-100 d-flex flex-column justify-content-start align-items-start">
                              <span className="mt-1 text-truncate text-green">
                                {room.Users[0].username}
                              </span>
                              <div className="w-100 d-flex flex-row justify-content-start align-items-center gap-1 text-muted text-sm">
                                {room.Messages.length > 0 ? (
                                  room.Messages[0]?.senderId ===
                                  currentUser.id ? (
                                    <small>You: </small>
                                  ) : (
                                    <small>Them:</small>
                                  )
                                ) : (
                                  <small className="last-message">
                                    No messages
                                  </small>
                                )}
                                <small className="last-message text-truncate text-muted">
                                  {room.Messages[0]?.content.slice(0, 20)}{room.Messages[0]?.content.trim().length>15 && <>...</>}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-bottom border-2 border-gray"></div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
          <div
            id="chat-box"
            className="w-100 d-flex flex-column justify-content-between border rounded shadow h-100"
          >
            <div
              id="chat-box-header"
              className="d-flex flex-row align-items-center justify-content-between p-2 border-bottom border-2 border-gray"
            >
              {currentRoom.room && (
                <>
                  <div className="d-flex flex-row align-items-center gap-2">
                    <img
                      src={
                        currentRoom.user?.profilePicture ||
                        "https://res.cloudinary.com/djwhrh0w7/image/upload/c_fill,w_100,h_100/v1716060482/profile_uakprb.png"
                      }
                      alt="avatar"
                      className="rounded-circle border border-2 border-primary object-fit-cover"
                      style={{ width: "45px", height: "45px" }}
                    />
                    <span className="text-green">
                      {currentRoom.user?.username}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-2">
                    <i className="fa-solid fa-info-circle"></i>
                  </div>
                </>
              )}
            </div>
            <div
              id="chat-box-messages"
              className="d-flex flex-column-reverse py-lg-3 p-lg-3 p-1 pt-3 pb-3 h-100 overflow-y-scroll"
            >
              {messageLoading ? (
                <div className="d-flex flex-column align-items-center justify-content-center gap-2 h-100">
                  <i className=" h1 fa-solid fa-ghost fa-spin text-secondary"></i>
                </div>
              ) : (
                <>
                  {currentMessages.length === 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center gap-2 h-100">
                      <i className=" h1 fa-solid fa-ghost text-secondary"></i>
                      No messages. yet!
                    </div>
                  ) : (
                    currentMessages.map((msg, index) => (
                      <div
                        key={msg.id || -1}
                        className={`message ${
                          msg.senderId === currentUser.id ? "sent" : "received"
                        } ${
                          currentMessages[index + 1]?.senderId !== msg.senderId
                            ? "mt-4"
                            : "mt-1"
                        }`}
                      >
                        {msg.senderId === currentUser.id ? (
                          <div className="d-flex flex-row-reverse align-items-end justify-content-start gap-2 px-lg-3 px-1">
                            <div className="col-auto">
                              {currentMessages[index - 1]?.senderId !==
                              msg.senderId ? (
                                <img
                                  src={
                                    currentUser.profilePicture?.replace(
                                      "upload/",
                                      "upload/c_fill,w_100,h_100/"
                                    ) ||
                                    "https://res.cloudinary.com/djwhrh0w7/image/upload/c_fill,w_100,h_100/v1716060482/profile_uakprb.png"
                                  }
                                  alt="avatar"
                                  className="avatar rounded-circle object-fit-cover"
                                />
                              ) : (
                                <div style={{ width: "40px" }}></div>
                              )}
                            </div>

                            <div className="content-box rounded-top-3 rounded-start-3 p-2 w-auto">
                              <div className="content-box-inner d-flex flex-column w-100 h-100">
                                <span className="content">{msg.content}</span>
                                <small
                                  className="time text-sm text-end"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {formatDate(msg.createdAt)}
                                </small>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-row align-items-end justify-content-start gap-2 px-lg-3 px-1">
                            <div className="col-auto">
                              {currentMessages[index - 1]?.senderId !==
                              msg.senderId ? (
                                <img
                                  src={
                                    currentRoom.user?.profilePicture?.replace(
                                      "upload/",
                                      "upload/c_fill,w_100,h_100/"
                                    ) ||
                                    "https://res.cloudinary.com/djwhrh0w7/image/upload/c_fill,w_100,h_100/v1716060482/profile_uakprb.png"
                                  }
                                  alt="avatar"
                                  className="avatar rounded-circle object-fit-cover"
                                />
                              ) : (
                                <div style={{ width: "40px" }}></div>
                              )}
                            </div>
                            <div className="content-box rounded-top-3 rounded-end-3 p-2 bg-light w-auto">
                              <div className="content-box-inner d-flex flex-column w-100 h-100">
                                <span className="content">{msg.content}</span>
                                <small
                                  className="text-muted text-sm"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {formatDate(msg.createdAt)}
                                </small>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            <div
              id="chat-box-input"
              className="d-flex flex-row align-items-center gap-2 justify-content-between p-2 border-top border-2 border-gray align-self-end w-100"
            >
              <input
                type="text"
                className="form-control"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSendMessage()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;