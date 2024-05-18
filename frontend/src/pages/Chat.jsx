import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import * as api from "../api/index";
import "../assets/css/chat.css";
import PageTitle from "../components/PageTitle";
import { useParams } from "react-router-dom";

function Chat() {
  const { userId } = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState({});

  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const tempMessages = [
    {
      id: 1,
      content:
        "yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo !!!!!!",
      senderId: 12,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 13,
      content:
        "yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo !!!!!!",
      senderId: 12,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 14,
      content:
        "yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo yo !!!!!!",
      senderId: 12,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 7,
      content: "my name is Skyler White yo",
      senderId: 19,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 8,
      content: "my husband is Walter White yo",
      senderId: 19,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 10,
      content: "he told me everything!",
      senderId: 19,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 11,
      content: "Jee chill out yo!",
      senderId: 12,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
    {
      id: 11,
      content: "sorry 🙄",
      senderId: 19,
      isSeen: true,
      roomId: 5,
      createdAt: "2021-09-01T00:00:00.000Z",
    },
  ];
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
    if (!userId) {
      setMessageLoading(false);
      return;
    }
    const fetchMessagesByUser = async () => {
      try {
        const response = await api.getRoomByUser(userId);
        setCurrentRoom({
          ...response.data,
          user: response.data.user,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessagesByUser();
  }, [userId]);

  useEffect(() => {
    if (!currentRoom || !currentRoom.room) {
      setMessageLoading(false);
      return;
    }
    const fetchMessages = async () => {
      try {
        const response = await api.getMessagesInRoom(currentRoom.room.id);
        setCurrentMessages(tempMessages.reverse());
        setMessageLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [currentRoom]);

  const handleChatRoomChange = (room) => {
    setCurrentRoom({
      ...room,
      user: room.Users[0],
    });
    setMessageLoading(true);
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
                      <>
                        <div
                          key={room.id}
                          className="room py-3 active"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleChatRoomChange(room)}
                        >
                          <div className="d-flex flex-row align-items-start gap-2 px-3">
                            <img
                              src={room.Users[0].profilePicture}
                              alt="avatar"
                              className="rounded-circle border border-2 border-primary object-fit-cover"
                              style={{ width: "50px", height: "50px" }}
                            />
                            <div className="w-100 d-flex flex-column justify-content-start align-items-start">
                              <span className="mt-1 text-truncate text-green">
                                {room.Users[0].username}
                              </span>
                              <div className="w-100 d-flex flex-row justify-content-start align-items-center gap-1 text-muted text-sm">
                                {room.Messages.length > 0 ? (
                                  room.Messages[0]?.User.id ===
                                  currentUser.id ? (
                                    <small>You: </small>
                                  ) : (
                                    <small>
                                      {room.Messages[0]?.User.username}
                                    </small>
                                  )
                                ) : (
                                  <small className="last-message">
                                    No messages
                                  </small>
                                )}
                                <small className="last-message text-truncate text-muted">
                                  {room.Messages[0]?.content}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-bottom border-2 border-gray"></div>
                      </>
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
                      src={currentRoom.user?.profilePicture}
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
              className="d-flex flex-column-reverse gap-3 py-lg-3 p-lg-3 p-1 pt-3 pb-3 h-100 overflow-y-scroll"
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
                    currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${
                          msg.senderId === currentUser.id ? "sent" : "received"
                        }`}
                      >
                        {msg.senderId === currentUser.id ? (
                          <div className="d-flex flex-row align-items-start justify-content-end gap-2 px-lg-3 px-1">
                            <div className="content-box rounded-bottom-3 rounded-start-3 bg-primary">
                              <div className="p-2 w-auto">
                                <div className="content-box-inner d-flex flex-column w-100 h-100">
                                  <span className="content text-white">
                                    {msg.content}
                                  </span>
                                  <small
                                    className="time text-sm text-end"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {new Date(msg.createdAt).toLocaleString()}
                                  </small>
                                </div>
                              </div>
                            </div>
                            <img
                              src={currentUser.profilePicture.replace(
                                "upload/",
                                "upload/c_fill,w_100,h_100/"
                              )}
                              alt="avatar"
                              className="avatar col-auto rounded-circle object-fit-cover"
                            />
                          </div>
                        ) : (
                          <div className="d-flex flex-row align-items-start justify-content-start gap-2 px-lg-3 px-1">
                            <img
                              src={currentRoom.user.profilePicture.replace(
                                "upload/",
                                "upload/c_fill,w_100,h_100/"
                              )}
                              alt="avatar"
                              className="avatar rounded-circle object-fit-cover"
                            />
                            <div className="content-box border border-2 border-gray rounded-bottom-3 rounded-end-3 p-2 bg-light w-auto">
                              <div className="content-box-inner d-flex flex-column w-100 h-100">
                                <span className="content">{msg.content}</span>
                                <small
                                  className="text-muted text-sm"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {new Date(msg.createdAt).toLocaleString()}
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