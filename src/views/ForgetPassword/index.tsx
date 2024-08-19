import { Link } from "react-router-dom";
import "./index.css";
import { Form, Input, notification } from "antd";
import { useState } from "react";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { requestOptions } from "../../hooks/utils";
import { API_ROOT } from "../../constant";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";

function ForgetPassword() {
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const [email, setEmail] = useState("");

  const handleForgetPassword = async () => {
    if (!email) {
      api.open({
        message: "Vui lòng nhập email",
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
      return;
    }
    const forgetPasswordRes = await authFetch(
      `${API_ROOT}/auth/forgot-password`,
      {
        ...requestOptions,
        body: JSON.stringify({ email: email }),
        method: "POST",
        headers: {
          ...requestOptions.headers,
        },
      }
    );

    if (forgetPasswordRes.ok) {
      api.open({
        message: `Mật khẩu đã mới đã được gửi trong email: ${email}`,
        icon: <SmileOutlined style={{ color: "blue" }} />,
      });
    } else {
      api.open({
        message: `Email đã nhập sai`,
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
  };
  return (
    <div className="ForgetPassword">
      {contextHolder}
      <Form className="container" onFinish={handleForgetPassword}>
        <div className="title">Quên mật khẩu</div>
        <Form.Item style={{ width: "70%" }}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-email"
            type="email"
            placeholder="Email"
          />
        </Form.Item>
        <div className="action">
          <button type="submit">Gửi mail</button>
          <Link to="/login">
            <button>Đăng nhập</button>
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default ForgetPassword;
