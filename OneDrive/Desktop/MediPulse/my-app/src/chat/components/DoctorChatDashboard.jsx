// src/components/chat/DoctorChatDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { List, Input, Button, Spin } from "antd";
import "../auth/login.css";

const socket = io("http://localhost:1050", {
  withCredentials: true,
});

const DoctorChatDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isDoctor = user?.role === "doctor";
  const doctorId = user?._id;

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Register doctor with socket
  useEffect(() => {
    if (!doctorId) return;

    socket.emit("registerUser", {
      userId: doctorId,
      name: user?.name,
      role: user?.role,
    });

    // listen for incoming doctorChatMessage
    socket.on("doctorChatMessage", (msg) => {
      // if this message belongs to active room, append
      setMessages((prev) => {
        if (msg.roomId === activeRoom?._id) {
          return [...prev, msg];
        }
        return prev;
      });

      // update rooms list ordering
      setRooms((prev) => {
        const updated = prev.map((r) =>
          r._id === msg.roomId
            ? { ...r, lastMessageText: msg.text, lastMessageAt: msg.createdAt }
            : r
        );
        // sort newest first
        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
        );
      });
    });

    return () => {
      socket.off("doctorChatMessage");
    };
  }, [doctorId, user?.name, user?.role, activeRoom]);

  // Fetch rooms list
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await fetch(
          `http://localhost:1050/chat/rooms/${doctorId}`
        );
        const data = await res.json();
        if (res.ok) {
          setRooms(
            data.sort(
              (a, b) =>
                new Date(b.lastMessageAt || 0) -
                new Date(a.lastMessageAt || 0)
            )
          );
        }
      } catch (err) {
        console.error("fetchRooms error:", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    if (doctorId) fetchRooms();
  }, [doctorId]);

  const handleSelectRoom = async (room) => {
    setActiveRoom(room);
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `http://localhost:1050/chat/room/${room._id}/messages`
      );
      const data = await res.json();
      if (res.ok) {
        const mapped = data.map((m) => ({
          _id: m._id,
          roomId: m.room,
          senderId: m.sender?._id,
          senderName: m.sender?.name,
          text: m.text,
          createdAt: m.createdAt,
        }));
        setMessages(mapped);
      }
    } catch (err) {
      console.error("fetch messages error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = () => {
    if (!text.trim() || !activeRoom) return;

    socket.emit("doctorToUserMessage", {
      userId: activeRoom.user._id,
      doctorId,
      text: text.trim(),
      doctorName: user?.name,
    });

    setText("");
  };

  if (!isDoctor) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h2 className="login-title">Doctor panel only</h2>
          <p className="login-subtitle">
            You must be logged in as a doctor to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-card chat-card doctor-chat-card">
        <h2 className="login-title">Doctor Live Chats</h2>
        <p className="login-subtitle">
          Latest conversations appear at the top
        </p>

        <div className="doctor-chat-layout">
          {/* LEFT: ROOMS LIST */}
          <div className="doctor-room-list">
            {loadingRooms ? (
              <div className="doctor-empty-center">
                <Spin />
              </div>
            ) : rooms.length === 0 ? (
              <div className="doctor-empty-center">No chats yet</div>
            ) : (
              <List
                dataSource={rooms}
                renderItem={(room) => (
                  <List.Item
                    className={
                      activeRoom?._id === room._id
                        ? "doctor-room-item active"
                        : "doctor-room-item"
                    }
                    onClick={() => handleSelectRoom(room)}
                  >
                    <div className="doctor-room-name">
                      {room.user?.name || "Unknown User"}
                    </div>
                    <div className="doctor-room-last">
                      {room.lastMessageText || "No messages"}
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>

          {/* RIGHT: MESSAGES */}
          <div className="doctor-room-chat">
            {loadingMessages && activeRoom && (
              <div className="doctor-empty-center">
                <Spin />
              </div>
            )}

            {!activeRoom && !loadingMessages && (
              <div className="doctor-empty-center">
                Select a conversation to view messages
              </div>
            )}

            {activeRoom && !loadingMessages && (
              <>
                <div className="doctor-active-header">
                  <span className="doctor-active-name">
                    {activeRoom.user?.name}
                  </span>
                  <span className="doctor-active-email">
                    {activeRoom.user?.email}
                  </span>
                </div>

                <div className="chat-messages">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={
                        m.senderId === doctorId
                          ? "chat-message own-message"
                          : "chat-message"
                      }
                    >
                      <div className="chat-meta">
                        <span className="chat-user">{m.senderName}</span>
                        <span className="chat-time">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="chat-text">{m.text}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-row">
                  <Input
                    placeholder="Type a reply..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    className="login-main-btn"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorChatDashboard;
