// src/chat/components/DoctorList.jsx
import React, { useEffect, useState } from "react";
import { List, Avatar, Button, Tag } from "antd";
import axios from "axios";
import { ChatState } from "../ChatProvider";

const DoctorList = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/user/doctors",
        config
      );
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setLoading(false);
    }
  };

  const accessChat = async (doctorId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId: doctorId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
    } catch (err) {
      console.error("Error accessing doctor chat:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="doctor-list">
      <List
        loading={loading}
        dataSource={doctors}
        renderItem={(doc) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => accessChat(doc._id)}>
                Chat
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={doc.pic}>{doc.name?.[0]}</Avatar>}
              title={
                <>
                  {doc.name} <Tag color="purple">Doctor</Tag>
                </>
              }
              description={doc.email}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default DoctorList;
