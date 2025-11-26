// src/chat/ChatProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      if (location.pathname !== "/" && location.pathname !== "/register") {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
