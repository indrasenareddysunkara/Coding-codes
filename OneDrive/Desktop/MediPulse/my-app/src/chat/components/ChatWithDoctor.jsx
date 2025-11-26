import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Button, Input } from "antd";
import "../auth/login.css";

const socket = io("http://localhost:1050", {
  withCredentials: true,
});

// TEMP: put your doctor user's _id here (from MongoDB)
const DOCTOR_ID = "PUT_YOUR_DOCTOR_ID_HERE";

const ChatWithDoctor = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const userName = user?.name || "Guest";

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // fetch existing room & messages if any
  useEffect(() => {
    const fetchRoomAndMessages = async () => {
      try {
        const roomRes = await fetch(
          `http://localhost:1050/chat/room/user-doctor?userId=${userId}&doctorId=${DOCTOR_ID}`
        );
        if (roomRes.ok) {
          const roomData = await roomRes.json();
          setRoom(roomData);

          const msgRes = await fetch(
            `http://localhost:1050/chat/room/${roomData._id}/messages`
          );
          const msgData = await msgRes.json();
          if (msgRes.ok) {
            const mapped = msgData.map((m) => ({
              _id: m._id,
              roomId: m.room,
              senderId: m.sender?._id,
              senderName: m.sender?.name,
              text: m.text,
              createdAt: m.createdAt,
            }));
            setMessages(mapped);
          }
        } else {
          // no room yet → will be created when first message is sent
          setRoom(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("fetchRoomAndMessages error:", err);
      }
    };

    if (userId) fetchRoomAndMessages();
  }, [userId]);

  useEffect(() => {
    socket.emit("registerUser", {
      userId,
      name: userName,
      role: user?.role,
    });

    socket.on("doctorChatMessage", (msg) => {
      // message belongs to this user-doctor room
      if (msg.senderId === userId || msg.senderId === DOCTOR_ID) {
        setMessages((prev) => [...prev, msg]);
        if (!room) {
          // if room wasn't set before, we can set a fake one with roomId
          setRoom((prevRoom) => prevRoom || { _id: msg.roomId });
        }
      }
    });

    return () => {
      socket.off("doctorChatMessage");
    };
  }, [userId, userName, user?.role, room]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    socket.emit("userToDoctorMessage", {
      userId,
      doctorId: DOCTOR_ID,
      text: text.trim(),
      userName,
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="login-wrapper">
      <div className="login-card chat-card">
        <h2 className="login-title">Chat with Doctor</h2>
        <p className="login-subtitle">
          Ask your health-related questions in real time
        </p>

        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((m) => (
              <div
                key={m._id || Math.random()}
                className={
                  m.senderId === userId
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
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button className="login-main-btn" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithDoctor;
