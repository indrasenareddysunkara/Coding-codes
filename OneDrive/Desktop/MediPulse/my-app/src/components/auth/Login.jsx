// src/components/auth/Login.jsx
import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");

        localStorage.setItem("userInfo", JSON.stringify(data));
        localStorage.setItem("token", data.token);

        navigate("/profile");
      } else {
        toast.error(data.message || "Invalid login credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card login-card-colored">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Login with Email &amp; Password</p>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          validateTrigger={["onChange", "onBlur"]}
          className="login-form"
        >
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
              prefix={<UserOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <div className="login-forgot-row">
            <Link to="/forgotpwd" className="link-btn">
              Forgot Password?
            </Link>
          </div>

          <Form.Item style={{ marginBottom: 12, marginTop: 8 }}>
            <Button
              type="default"
              htmlType="submit"
              size="large"
              block
              className="login-main-btn"
            >
              Log In
            </Button>
          </Form.Item>

          <div className="login-register-row">
            <span className="login-register-text">
              Don&apos;t have an account?
            </span>
            <Link to="/register" className="signup-btn">
              Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
