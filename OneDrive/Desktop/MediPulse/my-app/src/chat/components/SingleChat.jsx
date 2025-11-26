// src/chat/components/SingleChat.jsx
import React, { useEffect, useState } from "react";
import { Input, Typography, Spin } from "antd";
import axios from "axios";
import io from "socket.io-client";
import { ChatState } from "../ChatProvider";
import { getSenderName } from "../utils/chatLogics";
import ScrollableChat from "./ScrollableChat";

const { Title } = Typography;
const { TextArea } = Input;

const ENDPOINT = "http://localhost:5000";
let socket;
let selectedChatCompare;

const SingleChat = () => {
  const { selectedChat, user, notification, setNotification } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // 1️⃣ Setup socket connection WHEN user is available
  useEffect(() => {
    if (!user) {
      console.log("[socket] User not ready yet, skipping setup");
      return;
    }

    console.log("[socket] Connecting to", ENDPOINT);
    socket = io(ENDPOINT, {
      transports: ["websocket", "polling"],
    });

    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log("[socket] Connected event received from server");
      setSocketConnected(true);
    });

    socket.on("message recieved", (newMessageReceived) => {
      console.log("[socket] message received", newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.find((n) => n._id === newMessageReceived._id)) {
          setNotification((prev) => [newMessageReceived, ...prev]);
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    // cleanup on unmount
    return () => {
      console.log("[socket] disconnecting");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // 👈 depends on user, not []

  // 2️⃣ Fetch messages when chat changes
  const fetchMessages = async () => {
    if (!selectedChat || !user) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      console.log("[socket] joining room:", selectedChat._id);
      socket.emit("join chat", selectedChat._id);
      selectedChatCompare = selectedChat;
    } catch (err) {
      console.error("Failed to load messages:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // 3️⃣ Send message on Enter
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      if (!socketConnected) {
        console.warn("[socket] Not connected yet, message may not send");
      }
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");
        console.log("[socket] emitting new message", data);
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  if (!selectedChat) return null;

  const chatTitle = selectedChat.isGroupChat
    ? selectedChat.chatName
    : getSenderName(user, selectedChat.users);

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Title level={4} style={{ margin: 0 }}>
          {chatTitle}{" "}
          {!socketConnected && (
            <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
              (connecting...)
            </span>
          )}
        </Title>
      </div>
      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <ScrollableChat messages={messages} />
          <div className="message-input-row">
            <TextArea
              rows={2}
              placeholder="Type a message and press Enter..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={sendMessage}
            />
          </div>
        </>
      )}
    </>
  );
};

export default SingleChat;
