import { Form, Input, Button, notification } from "antd";
import { useState } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import "./index.css";
import { useUserStore } from "../../store/user";

type ChangePassProp = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ChangePassword() {
  const [form] = Form.useForm();
  const logout = useUserStore((state) => state.clear);
  const [api, contextHolder] = notification.useNotification();
  const authFetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: ChangePassProp) => {
    setLoading(true);

    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      api.error({
        message: "Mật khẩu mới không giống nhau",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await authFetch(`${API_ROOT}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword }),
      });

      if (res.ok) {
        api.success({
          message: "Đổi mật khẩu thành công",
        });
        logout();
        form.resetFields();
      } else {
        api.error({
          message: "Đổi mật khẩu thất bại",
        });
      }
    } catch (error) {
      api.error({
        message: "Lỗi lạ",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ChangePassword">
      {contextHolder}
      <div
        style={{
          backgroundColor: "white",
          width: "calc(100% - 40rem)",
          height: "calc(100% - 4rem)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "1rem",
        }}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: "Điền mật khẩu cũ" }]}
          >
            <Input.Password placeholder="Điền mật khẩu cũ" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ChangePassword;
