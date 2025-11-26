// src/chat/components/Chatbox.jsx
import React from "react";
import { Empty } from "antd";
import { ChatState } from "../ChatProvider";
import SingleChat from "./SingleChat";

const Chatbox = () => {
  const { selectedChat } = ChatState();

  if (!selectedChat) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty description="Select a chat or start a new one" />
      </div>
    );
  }

  return <SingleChat />;
};

export default Chatbox;
