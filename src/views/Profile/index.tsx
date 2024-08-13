import { Input, Button, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import "./index.css";
import { NumberToVND } from "../../helper";
import { useUserStore } from "../../store/user";
import { useMeMutation } from "../../hooks/useMe";

function Profile() {
  const me = useUserStore((state) => state.userInformation);
  const [api, contextHolder] = notification.useNotification();
  const { trigger: triggerMe } = useMeMutation();
  const setUserInformation = useUserStore((state) => state.setUserInformation);
  const authFetch = useAuthenticatedFetch();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(me?.fullName || "");
  const [email, setEmail] = useState(me?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(me?.phoneNumber || "");
  const [agentName, setAgentName] = useState(me?.agentName || "");
  const [address, setAddress] = useState(me?.address || "");
  const [taxCode, setTaxCode] = useState(me?.taxCode || "");
  const [gender, setGender] = useState(me?.gender || 1);

  useEffect(() => {
    if (me) {
      setFullName(me?.fullName);
      setEmail(me?.email);
      setPhoneNumber(me?.phoneNumber);
      setAgentName(me?.agentName || "");
      setAddress(me?.address || "");
      setTaxCode(me?.taxCode || "");
      setGender(me?.gender || 1);
    }
  }, [me]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setFullName(me?.fullName || "");
    setEmail(me?.email || "");
    setPhoneNumber(me?.phoneNumber || "");
    setAgentName(me?.agentName || "");
    setAddress(me?.address || "");
    setTaxCode(me?.taxCode || "");
    setGender(me?.gender || 1);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    let updateData;

    if (me?.type === "agent") {
      updateData = {
        fullName,
        email,
        phoneNumber,
        agentName,
        address,
        taxCode,
      };
    } else if (me?.type === "staff") {
      updateData = {
        fullName,
        email,
        phoneNumber,
        gender,
      };
    }

    const endpoint =
      me?.type === "agent"
        ? `${API_ROOT}/agent/update-agent/${me?.id}`
        : `${API_ROOT}/staff/update-staff/${me?.id}`;

    const res = await authFetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      api.success({
        message: "Cập nhật thành công",
      });
      const me = await triggerMe();
      setUserInformation(me);
      setIsEditing(false);
    } else {
      api.error({
        message: "Cập nhật thất bại",
      });
    }
  };

  if (me?.type === "agent") {
    return (
      <div className="AgentProfile Profile">
        {contextHolder}
        <h2>Hồ sơ Đại lý</h2>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "45%",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <strong className="marginTop1">Tên người đại diện:</strong>
              <strong className="marginTop1">Email:</strong>
              <strong className="marginTop1">Số điện thoại:</strong>
              <strong className="marginTop1">Tên đại lý:</strong>
              <strong className="marginTop1">Địa chỉ:</strong>
              <strong className="marginTop1">Mã số thuế:</strong>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginLeft: "10px",
              }}
            >
              <Input
                className="marginTop1"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div
            style={{
              width: "45%",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <strong className="marginTop1">Tên đăng nhập:</strong>
              <strong className="marginTop1">Cấp đại lý:</strong>
              <strong className="marginTop1">Công nợ tối đa:</strong>
              <strong className="marginTop1">Tài khoản hiện có:</strong>
              <strong className="marginTop1">Dư nợ:</strong>
              <strong className="marginTop1">Ngày gia nhập:</strong>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginLeft: "10px",
              }}
            >
              <Input className="marginTop1" value={me?.username} disabled />
              <Input className="marginTop1" value={me?.rank} disabled />
              <Input
                className="marginTop1"
                value={NumberToVND.format(me?.debitLimit)}
                disabled
              />
              <Input
                className="marginTop1"
                value={NumberToVND.format(me?.accountHave)}
                disabled
              />
              <Input
                className="marginTop1"
                value={NumberToVND.format(me?.accountDebit)}
                disabled
              />
              <Input
                className="marginTop1"
                value={new Date(me?.createdAt).toLocaleString()}
                disabled
              />
            </div>
          </div>
        </div>
        {isEditing ? (
          <>
            <Button
              type="primary"
              onClick={handleUpdate}
              style={{ marginRight: "10px" }}
            >
              OK
            </Button>
            <Button onClick={handleCancel}>Huỷ</Button>
          </>
        ) : (
          <Button type="primary" onClick={handleEditToggle}>
            Chỉnh sửa
          </Button>
        )}
      </div>
    );
  }

  if (me?.type === "staff") {
    return (
      <div className="StaffProfile Profile">
        {contextHolder}
        <h2>Hồ sơ Nhân viên</h2>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "45%",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <strong className="marginTop1">Tên người dùng:</strong>
              <strong className="marginTop1">Email:</strong>
              <strong className="marginTop1">Số điện thoại:</strong>
              <strong className="marginTop1">Giới tính:</strong>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginLeft: "10px",
              }}
            >
              <Input
                className="marginTop1"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
              <Input
                className="marginTop1"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
              />
              <Select
                className="marginTop1"
                value={gender}
                onChange={(value) => setGender(value)}
                disabled={!isEditing}
              >
                <Select.Option value={1}>Nam</Select.Option>
                <Select.Option value={2}>Nữ</Select.Option>
              </Select>
            </div>
          </div>
          <div
            style={{
              width: "45%",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <strong className="marginTop1">Tên đăng nhập:</strong>
              <strong className="marginTop1">Vai trò:</strong>
              <strong className="marginTop1">Ngày gia nhập:</strong>
              <strong className="marginTop1">Ngày cập nhật:</strong>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginLeft: "10px",
              }}
            >
              <Input className="marginTop1" value={me?.username} disabled />
              <Input className="marginTop1" value={me?.roleName} disabled />
              <Input
                className="marginTop1"
                value={new Date(me?.createdAt).toLocaleString()}
                disabled
              />
              <Input
                className="marginTop1"
                value={new Date(me?.updatedAt).toLocaleString()}
                disabled
              />
            </div>
          </div>
        </div>
        {isEditing ? (
          <>
            <Button
              type="primary"
              onClick={handleUpdate}
              style={{ marginRight: "10px" }}
            >
              OK
            </Button>
            <Button onClick={handleCancel}>Huỷ</Button>
          </>
        ) : (
          <Button type="primary" onClick={handleEditToggle}>
            Chỉnh sửa
          </Button>
        )}
      </div>
    );
  }

  return null;
}

export default Profile;
