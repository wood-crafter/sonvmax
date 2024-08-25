import { Input, Button, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import "./index.css";
import { NumberToVND } from "../../helper";
import { useUserStore } from "../../store/user";
import { useMeMutation } from "../../hooks/useMe";
import { AgentInfo, StaffInfo } from "../../type";

// Type guard to check if the user is an agent
function isAgentInfo(me: AgentInfo | StaffInfo | null): me is AgentInfo {
  return me?.type === "agent";
}

// Type guard to check if the user is a staff member
function isStaffInfo(me: AgentInfo | StaffInfo | null): me is StaffInfo {
  return me?.type === "staff";
}

function Profile() {
  const me = useUserStore((state) => state.userInformation);
  const [api, contextHolder] = notification.useNotification();
  const { trigger: triggerMe } = useMeMutation();
  const setUserInformation = useUserStore((state) => state.setUserInformation);
  const authFetch = useAuthenticatedFetch();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(me?.fullName || "");
  const [email, setEmail] = useState(isAgentInfo(me) ? me?.email : "");
  const [phoneNumber, setPhoneNumber] = useState(me?.phoneNumber || "");
  const [agentName, setAgentName] = useState(
    isAgentInfo(me) ? me?.agentName : ""
  );
  const [address, setAddress] = useState(isAgentInfo(me) ? me?.address : "");
  const [taxCode, setTaxCode] = useState(isAgentInfo(me) ? me?.taxCode : "");
  const [gender, setGender] = useState(isStaffInfo(me) ? me?.gender : 1);

  useEffect(() => {
    if (me) {
      setFullName(me?.fullName);
      setEmail(me.email);
      setPhoneNumber(me?.phoneNumber);
      setAgentName(isAgentInfo(me) ? me?.agentName : "");
      setAddress(isAgentInfo(me) ? me?.address : "");
      setTaxCode(isAgentInfo(me) ? me?.taxCode : "");
      setGender(isStaffInfo(me) ? me?.gender : 1);
    }
  }, [me]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    if (me) {
      setFullName(me?.fullName);
      setEmail(isAgentInfo(me) ? me?.email : "");
      setPhoneNumber(me?.phoneNumber);
      setAgentName(isAgentInfo(me) ? me?.agentName : "");
      setAddress(isAgentInfo(me) ? me?.address : "");
      setTaxCode(isAgentInfo(me) ? me?.taxCode : "");
      setGender(isStaffInfo(me) ? me?.gender : 1);
      setIsEditing(false);
    }
  };

  const handleUpdate = async () => {
    let updateData;

    if (isAgentInfo(me)) {
      updateData = {
        fullName,
        email,
        phoneNumber,
        agentName,
        address,
        taxCode,
      };
    } else if (isStaffInfo(me)) {
      updateData = {
        fullName,
        email,
        phoneNumber,
        gender,
      };
    }

    const endpoint = isAgentInfo(me)
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
      const updatedMe = await triggerMe();
      setUserInformation(updatedMe);
      setIsEditing(false);
    } else {
      api.error({
        message: "Cập nhật thất bại",
      });
    }
  };

  if (isAgentInfo(me)) {
    return (
      <div className="AgentProfile Profile">
        {contextHolder}
        <h2 style={{ color: "black" }}>Hồ sơ Đại lý</h2>
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
              <strong className="marginTop1">Dư nợ hiện tại:</strong>
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
                value={NumberToVND.format(+me?.debitLimit)}
                disabled
              />
              <Input
                className="marginTop1"
                value={NumberToVND.format(+me?.accountHave)}
                disabled
              />
              <Input
                className="marginTop1"
                value={NumberToVND.format(+me?.accountDebit)}
                disabled
              />
              <Input className="marginTop1" value={me?.createdAt} disabled />
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

  if (isStaffInfo(me)) {
    return (
      <div className="StaffProfile Profile">
        {contextHolder}
        <h2 style={{ color: "black" }}>Hồ sơ Nhân viên</h2>
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
                <Select.Option value={0}>Nữ</Select.Option>
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
              <Input className="marginTop1" value={me?.createdAt} disabled />
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
