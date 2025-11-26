// src/components/auth/Profile.jsx
import React, { useEffect, useState } from "react";
import { Card, Button, Avatar, Typography, Divider } from "antd";
import {
  UserOutlined,
  MessageOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    let parsed = null;

    if (storedUserInfo) {
      try {
        parsed = JSON.parse(storedUserInfo);
      } catch {}
    }

    if (!parsed) {
      navigate("/");
    } else {
      setUser(parsed);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToChat = () => {
    navigate("/chat");
  };

  if (!user) return null;

  return (
    <div className="login-wrapper">
      <div
        className="login-card login-card-colored"
        style={{ maxWidth: 520, width: "100%" }}
      >
        <Card
          bordered={false}
          style={{ background: "transparent", boxShadow: "none" }}
          bodyStyle={{ padding: 0 }}
        >
          <div className="profile-header">
            <Avatar
              size={72}
              style={{
                backgroundColor: "#0D8A9A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={!user.name && <UserOutlined />}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : ""}
            </Avatar>

            <div className="profile-info">
              <Title
                level={3}
                style={{ marginBottom: 4, color: "#0D8A9A", letterSpacing: 1 }}
              >
                {user.name || "User"}
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {user.email}
              </Text>
              <Text style={{ fontSize: 13, color: "#777" }}>
                Role: {user.role || "user"}
              </Text>
            </div>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div style={{ marginBottom: 18, textAlign: "left" }}>
            <Title
              level={5}
              style={{ marginBottom: 6, color: "#333", letterSpacing: 0.5 }}
            >
              Account Overview
            </Title>
            <Text style={{ fontSize: 14, color: "#555" }}>
              You’re logged into <b>MediPulse</b>. Join the community chat to
              talk with other users, or connect directly with doctors for
              personalized help.
            </Text>
          </div>

          <div className="profile-actions">
            <Button
              type="primary"
              size="large"
              icon={<TeamOutlined />}
              className="login-main-btn"
              onClick={goToChat}
            >
              Community & Chats
            </Button>

            <Button
              type="default"
              size="large"
              icon={<MessageOutlined />}
              style={{
                borderRadius: 14,
                height: 44,
                fontWeight: 600,
                borderColor: "#0D8A9A",
                color: "#0D8A9A",
              }}
              onClick={goToChat}
            >
              Chat with Doctor
            </Button>

            <Button
              type="text"
              danger
              style={{ marginTop: 8 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
