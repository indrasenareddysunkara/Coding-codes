// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./chat/ChatProvider";

import "antd/dist/reset.css";
import "./styles/login.css";
import "./chat/styles/chatTheme.css";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);
