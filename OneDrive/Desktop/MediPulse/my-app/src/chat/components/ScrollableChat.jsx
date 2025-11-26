// src/chat/components/ScrollableChat.jsx
import React, { useEffect, useRef } from "react";
import { Avatar, Tooltip } from "antd";
import { ChatState } from "../ChatProvider";
import { isSameSenderMargin, isSameUser } from "../utils/chatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="messages-container">
      {messages &&
        messages.map((m, i) => (
          <div key={m._id || i} className="message-row">
            {m.sender._id !== user._id && (
              <div
                style={{
                  marginRight: 6,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                <Tooltip title={m.sender.name}>
                  <Avatar size="small" src={m.sender.pic}>
                    {m.sender.name[0]}
                  </Avatar>
                </Tooltip>
              </div>
            )}

            <div
              className={
                "message-bubble " +
                (m.sender._id === user._id
                  ? "message-bubble-own"
                  : "message-bubble-other")
              }
              style={{
                marginLeft:
                  m.sender._id === user._id
                    ? "auto"
                    : isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ScrollableChat;
