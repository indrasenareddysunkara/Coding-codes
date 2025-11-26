// src/chat/components/SideDrawer.jsx
import React from "react";
import { Avatar, Button, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../ChatProvider";

const SideDrawer = () => {
  const { user, setUser } = ChatState();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const menu = (
    <Menu
      items={[
        {
          key: "profile",
          label: "Profile",
          onClick: () => navigate("/profile"),
        },
        { type: "divider" },
        {
          key: "logout",
          label: "Logout",
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <div className="chat-topbar">
      <div className="chat-topbar-left">
        <span className="chat-logo">MediPulse Chat</span>
        <span className="chat-logo-sub">
          Stay connected with your care team
        </span>
      </div>
      <div className="chat-topbar-right">
        {user && (
          <Dropdown overlay={menu} placement="bottomRight">
            <div className="chat-user-pill">
              <Avatar
                size="small"
                style={{ backgroundColor: "#0D8A9A" }}
              >
                {user.name ? user.name[0].toUpperCase() : "U"}
              </Avatar>
              <span className="chat-user-name">{user.name}</span>
            </div>
          </Dropdown>
        )}
        <Button
          type="primary"
          className="chat-topbar-btn"
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
};

export default SideDrawer;
