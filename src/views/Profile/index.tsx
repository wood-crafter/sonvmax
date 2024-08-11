import { Spin, Input, Button, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useMe } from "../../hooks/useMe";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import "./index.css";
import { NumberToVND } from "../../helper";

function Profile() {
  const { data, isLoading, mutate } = useMe();
  const [api, contextHolder] = notification.useNotification();
  const authFetch = useAuthenticatedFetch();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(data?.fullName || "");
  const [email, setEmail] = useState(data?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber || "");
  const [agentName, setAgentName] = useState(data?.agentName || "");
  const [address, setAddress] = useState(data?.address || "");
  const [taxCode, setTaxCode] = useState(data?.taxCode || "");
  const [gender, setGender] = useState(data?.gender || 1);

  useEffect(() => {
    if (data) {
      setFullName(data.fullName);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setAgentName(data.agentName || "");
      setAddress(data.address || "");
      setTaxCode(data.taxCode || "");
      setGender(data.gender || 1);
    }
  }, [data]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setFullName(data?.fullName || "");
    setEmail(data?.email || "");
    setPhoneNumber(data?.phoneNumber || "");
    setAgentName(data?.agentName || "");
    setAddress(data?.address || "");
    setTaxCode(data?.taxCode || "");
    setGender(data?.gender || 1);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    let updateData;

    if (data.type === "agent") {
      updateData = {
        fullName,
        email,
        phoneNumber,
        agentName,
        address,
        taxCode,
      };
    } else if (data.type === "staff") {
      updateData = {
        fullName,
        email,
        phoneNumber,
        gender,
      };
    }

    const endpoint =
      data.type === "agent"
        ? `${API_ROOT}/agent/update-agent/${data.id}`
        : `${API_ROOT}/staff/update-staff/${data.id}`;

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
      mutate();
      setIsEditing(false);
    } else {
      api.error({
        message: "Cập nhật thất bại",
      });
    }
  };

  if (isLoading) return <Spin />;

  if (data?.type === "agent") {
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
              <Input className="marginTop1" value={data.username} disabled />
              <Input className="marginTop1" value={data.rank} disabled />
              <Input
                className="marginTop1"
                value={NumberToVND.format(data.debitLimit)}
                disabled
              />
              <Input
                className="marginTop1"
                value={NumberToVND.format(data.accountHave)}
                disabled
              />
              <Input
                className="marginTop1"
                value={NumberToVND.format(data.accountDebit)}
                disabled
              />
              <Input
                className="marginTop1"
                value={new Date(data.createdAt).toLocaleString()}
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

  if (data?.type === "staff") {
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
              <Input className="marginTop1" value={data.username} disabled />
              <Input className="marginTop1" value={data.roleName} disabled />
              <Input
                className="marginTop1"
                value={new Date(data.createdAt).toLocaleString()}
                disabled
              />
              <Input
                className="marginTop1"
                value={new Date(data.updatedAt).toLocaleString()}
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
