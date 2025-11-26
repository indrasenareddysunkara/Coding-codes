// src/components/auth/ForgotPassword.jsx
import React from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    toast.info("Forgot password flow not implemented yet in backend.");
    // TODO: call /api/user/forgot-password
    // navigate("/reset-password");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card login-card-colored">
        <h2 className="login-title">Forgot Password</h2>
        <p className="login-subtitle">Enter your email to reset password</p>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              size="large"
              block
              className="login-main-btn"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
