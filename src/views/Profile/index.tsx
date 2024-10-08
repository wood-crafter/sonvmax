import { Input, Button, notification, Select, Spin } from "antd";
import { useState } from "react";
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
  const [isApiCalling, setIsApiCalling] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(me?.fullName || "");
  const [email, setEmail] = useState(me?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(me?.phoneNumber || "");
  const [agentName, setAgentName] = useState(
    isAgentInfo(me) ? me?.agentName : ""
  );
  const [address, setAddress] = useState(isAgentInfo(me) ? me?.address : "");
  const [taxCode, setTaxCode] = useState(isAgentInfo(me) ? me?.taxCode : "");
  const [gender, setGender] = useState(isStaffInfo(me) ? me?.gender : 1);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    if (me) {
      setFullName(me?.fullName);
      setEmail(me?.email ?? "");
      setPhoneNumber(me?.phoneNumber);
      setAgentName(isAgentInfo(me) ? me?.agentName : "");
      setAddress(isAgentInfo(me) ? me?.address : "");
      setTaxCode(isAgentInfo(me) ? me?.taxCode : "");
      setGender(isStaffInfo(me) ? me?.gender : 1);
      setIsEditing(false);
    }
  };

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleUpdate = async () => {
    let updateData;

    if (isAgentInfo(me)) {
      if (me.fullName && !fullName) {
        api.error({
          message: "Tên người đại diện không được bỏ trống!",
        });
        return;
      } else if (me.email && !email) {
        api.error({
          message: "Email không được để trống!",
        });
        return;
      } else if (me.phoneNumber && !phoneNumber) {
        api.error({
          message: "Số điện thoại không được để trống!",
        });
        return;
      } else if (me.agentName && !agentName) {
        api.error({
          message: "Tên đại lý không được để trống!",
        });
        return;
      } else if (me.address && !address) {
        api.error({
          message: "Địa chỉ không được để trống!",
        });
        return;
      } else if (me.taxCode && !taxCode) {
        api.error({
          message: "Mã số thuế không được để trống!",
        });
        return;
      }

      if (email && !isValidEmail(email)) {
        api.error({
          message: "Email không hợp lệ!",
        });
        return;
      }
      updateData = {
        fullName,
        email,
        phoneNumber,
        agentName,
        address,
        taxCode,
        username: me?.username,
        rank: me?.rank,
      };
    } else if (isStaffInfo(me)) {
      if (me.fullName && !fullName) {
        api.error({
          message: "Tên người đại diện không được bỏ trống!",
        });
        return;
      } else if (me.email && !email) {
        api.error({
          message: "Email không được để trống!",
        });
        return;
      } else if (me.phoneNumber && !phoneNumber) {
        api.error({
          message: "Số điện thoại không được để trống!",
        });
        return;
      } else if (me.gender && !gender) {
        api.error({
          message: "Giới tính không được để trống!",
        });
        return;
      }
      if (email && !isValidEmail(email)) {
        api.error({
          message: "Email không hợp lệ!",
        });
        return;
      }
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

    setIsApiCalling(true);
    const res = await authFetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    setIsApiCalling(false);
    if (res.ok) {
      api.success({
        message: "Cập nhật thành công",
      });
      const updatedMe = await triggerMe();
      setUserInformation(updatedMe);
      setIsEditing(false);
    } else {
      const resJons = await res.json();
      api.error({
        message: "Cập nhật thất bại",
        description: resJons?.message,
      });
    }
  };

  if (isAgentInfo(me)) {
    return (
      <div className="AgentProfile Profile">
        {contextHolder}
        <h2 style={{ color: "black" }}>Hồ sơ Đại lý</h2>
        {isApiCalling && <Spin spinning={isApiCalling} />}
        {!isApiCalling && (
          <>
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
                  <Input
                    className="marginTop1"
                    value={me?.createdAt}
                    disabled
                  />
                </div>
              </div>
            </div>
            <>
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
            </>
          </>
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
