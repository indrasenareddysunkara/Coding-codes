// src/chat/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { Layout, Button, Tabs, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ChatState } from "./ChatProvider";
import MyChats from "./components/MyChats";
import Chatbox from "./components/Chatbox";
import DoctorList from "./components/DoctorList";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const ChatPage = () => {
  const { user } = ChatState();
  const [activeTab, setActiveTab] = useState("chats");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="chat-page-wrapper">
      <Layout className="chat-layout">
        <Header className="chat-header">
          <div>
            <div className="chat-header-title">MediPulse Chat</div>
            <Text style={{ color: "#e5f9ff", fontSize: 13 }}>
              Stay connected with your community & doctors
            </Text>
          </div>
          <div className="chat-header-user">
            <span style={{ marginRight: 12 }}>Hi, {user.name}</span>
            <Button size="small" onClick={() => navigate("/profile")}>
              Back to Profile
            </Button>
          </div>
        </Header>

        <Layout>
          <Sider width={330} className="chat-sidebar" theme="light">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: "chats", label: "My & Community Chats" },
                { key: "doctors", label: "Doctors" },
              ]}
            />
            {activeTab === "chats" ? <MyChats /> : <DoctorList />}
          </Sider>

          <Content className="chat-main">
            <Chatbox />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ChatPage;
