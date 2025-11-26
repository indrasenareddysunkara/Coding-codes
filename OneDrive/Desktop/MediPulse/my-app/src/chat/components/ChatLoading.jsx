// src/chat/components/ChatLoading.jsx
import React from "react";
import { Skeleton } from "antd";

const ChatLoading = () => {
  return (
    <div>
      {Array.from({ length: 8 }).map((_, idx) => (
        <Skeleton
          key={idx}
          active
          paragraph={false}
          title={{ width: "80%" }}
          style={{ marginBottom: 10 }}
        />
      ))}
    </div>
  );
};

export default ChatLoading;
