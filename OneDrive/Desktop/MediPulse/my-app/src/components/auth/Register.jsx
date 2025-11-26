// src/components/auth/Register.jsx
import React, { useState } from "react";
import { Form, Input, Button, Radio } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Register = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState("user");

  const onFinish = async (values) => {
    const payload = { ...values, role };

    try {
      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful!");

        localStorage.setItem("userInfo", JSON.stringify(data));
        localStorage.setItem("token", data.token);

        // Optionally navigate to profile or chat
        // navigate("/profile");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error during registration");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card login-card-colored">
        <h2 className="login-title">Register</h2>
        <p className="login-subtitle">
          Create an account to manage your health &amp; fitness
        </p>

        <div className="register-role-toggle">
          <Radio.Group
            value={role}
            onChange={(e) => setRole(e.target.value)}
            size="small"
          >
            <Radio.Button value="user">User</Radio.Button>
            <Radio.Button value="doctor">Doctor</Radio.Button>
          </Radio.Group>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          validateTrigger={["onChange", "onBlur"]}
          className="login-form"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              { min: 3, message: "Minimum 3 characters" },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              size="large"
              placeholder="Full Name"
              prefix={<UserOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
            hasFeedback
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            style={{ marginBottom: 20 }}
          >
            <Input.Password
              size="large"
              placeholder="Confirm Password"
              prefix={<LockOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="default"
              htmlType="submit"
              size="large"
              block
              className="login-main-btn"
            >
              Register
            </Button>
          </Form.Item>

          <div className="login-register-row">
            <span className="login-register-text">Already registered?</span>
            <Link to="/" className="signup-btn">
              Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
