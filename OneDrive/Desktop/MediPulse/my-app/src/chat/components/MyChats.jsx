// src/chat/components/MyChats.jsx
import React, { useEffect, useState } from "react";
import { List, Tag, Typography } from "antd";
import axios from "axios";
import { ChatState } from "../ChatProvider";
import { getSenderName } from "../utils/chatLogics";

const { Text } = Typography;

const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:5000/api/chat", config);
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading chats:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <List
        loading={loading}
        dataSource={chats}
        renderItem={(chat) => {
          const isSelected = selectedChat && selectedChat._id === chat._id;
          const isCommunity =
            chat.isGroupChat && chat.chatName === "Community Chat";

          const title = chat.isGroupChat
            ? chat.chatName
            : getSenderName(user, chat.users);

          return (
            <div
              className={
                "chat-list-item " +
                (isSelected ? "chat-list-item-selected" : "")
              }
              onClick={() => setSelectedChat(chat)}
            >
              <div className="chat-list-title">
                {title}{" "}
                {isCommunity && (
                  <Tag color="geekblue" style={{ marginLeft: 6 }}>
                    Community
                  </Tag>
                )}
              </div>
              {chat.latestMessage && (
                <div className="chat-list-subtitle">
                  <b>{chat.latestMessage.sender.name}: </b>
                  <Text
                    ellipsis
                    style={{
                      maxWidth: "100%",
                    }}
                  >
                    {chat.latestMessage.content}
                  </Text>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default MyChats;
