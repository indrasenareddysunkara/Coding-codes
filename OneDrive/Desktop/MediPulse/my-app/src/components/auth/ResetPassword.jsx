// src/components/auth/ResetPassword.jsx
import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  // In real use, you'd get token/query params from location.search

  const onFinish = async (values) => {
    toast.info("Reset password backend not implemented yet.");
    // TODO: call /api/user/reset-password
    navigate("/");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card login-card-colored">
        <h2 className="login-title">Reset Password</h2>
        <p className="login-subtitle">Choose a new password</p>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="New Password"
              prefix={<LockOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm the password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm Password"
              prefix={<LockOutlined style={{ marginRight: 8 }} />}
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
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
