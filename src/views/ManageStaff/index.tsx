import { useState } from "react";
import "./index.css";
import {
  Table,
  Space,
  Button,
  Modal,
  notification,
  Input,
  Radio,
  Popconfirm,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  QuestionCircleOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { Role, Staff } from "../../type";
import { requestOptions, useStaffs } from "../../hooks/useStaff";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { API_ROOT } from "../../constant";
import { useRoles } from "../../hooks/useRoles";

function ManageStaff() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: rolesResponse } = useRoles(1);
  const { data, mutate: refreshStaffs } = useStaffs(1);
  const staffs = data?.data ?? [];
  const roles = rolesResponse?.data;

  const missingAddPropsNotification = () => {
    api.open({
      message: "Tạo thất bại",
      description: "Vui lòng điền đủ thông tin",
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const addSuccessNotification = () => {
    api.open({
      message: "Tạo thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const addFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Tạo thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const [gender, setGender] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState<string>("");

  const [nextFullName, setNextFullName] = useState("");
  const [nextPhoneNumber, setNextPhoneNumber] = useState("");
  const [nextIsActive, setNextIsActive] = useState(false);
  const [nextGender, setNextGender] = useState(0);
  const [nextUsername, setNextUsername] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [nextRole, setNextRole] = useState<string>("");

  const [currentEditing, setCurrentEditing] = useState<Staff | null>(null);
  const handleUpdateAgent = async () => {
    const updateData = {
      roleId: role,
      gender: +gender,
      isActive: isActive,
    };
    const updateBody = JSON.stringify(updateData);

    await authFetch(`${API_ROOT}/staff/update-staff/${currentEditing?.id}`, {
      ...requestOptions,
      body: updateBody,
      method: "PUT",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Staff) => {
    setGender(record.gender);
    setIsActive(record.isActive);
    setCurrentEditing(record);
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    await handleUpdateAgent();
    refreshStaffs();
    setIsModalOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRecord = async (record: Staff) => {
    await authFetch(`${API_ROOT}/staff/remove-staff/${record.id}`, {
      ...requestOptions,
      method: "DELETE",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshStaffs();
  };

  const clearAddInput = () => {
    setNextFullName("");
    setNextUsername("");
    setNextPassword("");
    setNextGender(0);
    setNextIsActive(false);
    setNextPhoneNumber("");
    setNextRole(roles ? roles[0].id : "");
  };

  const handleAddOk = async () => {
    if (
      !nextFullName ||
      !nextUsername ||
      !nextPassword ||
      !nextPhoneNumber ||
      !nextRole
    ) {
      missingAddPropsNotification();
      return;
    }
    const staffToAdd = JSON.stringify({
      roleId: nextRole,
      username: nextUsername,
      password: nextPassword,
      isActive: nextIsActive,
      gender: nextGender,
      phoneNumber: nextPhoneNumber,
      fullName: nextFullName,
    });

    const createResponse = await authFetch(
      `${API_ROOT}/staff/create-staff/${nextRole}`,
      {
        ...requestOptions,
        body: staffToAdd,
        method: "POST",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (createResponse.status !== 201) {
      addFailNotification(createResponse.status, createResponse.statusText);
    } else {
      addSuccessNotification();
    }
    refreshStaffs();
    clearAddInput();
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const columns: ColumnType<Staff>[] = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Hoạt động",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <p style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Hoạt động" : "Tạm dừng"}
        </p>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: number) => <div>{gender === 1 ? "Nam" : "Nữ"}</div>,
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      render: (value: string) => (
        <div>{roles?.find((it) => it.id === value)?.name}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Staff) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Update</Button>
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn chắc chắn muốn xoá sản phẩm này?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteRecord(record)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ManageStaff">
      {contextHolder}
      <Button
        onClick={() => {
          setIsAddModalOpen(true);
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm nhân viên
      </Button>
      <Table columns={columns} dataSource={staffs} />
      <Modal
        title="Sửa thông tin nhân viên"
        open={isModalOpen}
        onOk={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      >
        {currentEditing && (
          <div className="modal-update-container">
            <label htmlFor="fullName">Họ và tên nhân viên: </label>
            <Input
              value={currentEditing?.fullName}
              type="text"
              name="fullName"
              readOnly
            />
            <label htmlFor="username">Tên đăng nhập: </label>
            <Input
              value={currentEditing?.username}
              type="text"
              name="username"
              readOnly
            />
            <Radio.Group
              onChange={(e) => {
                setGender(e.target.value);
              }}
              value={gender}
            >
              <Radio value={1}>Nam</Radio>
              <Radio value={0}>Nữ</Radio>
            </Radio.Group>
            <Radio.Group
              onChange={(e) => {
                setIsActive(e.target.value);
              }}
              value={isActive}
            >
              <Radio value={true}>Hoạt động</Radio>
              <Radio value={false}>Không hoạt động</Radio>
            </Radio.Group>
            <label htmlFor="role">Vai trò:</label>
            <select
              value={role}
              id="role"
              name="role"
              onChange={(e) => {
                setRole(e.target.value);
              }}
            >
              {roles?.map((role: Role) => {
                return (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </Modal>
      <Modal
        title="Thêm nhân viên"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <div className="modal-update-container">
          <label htmlFor="fullName">Tên đầy đủ nhân viên: </label>
          <Input
            value={nextFullName}
            type="text"
            placeholder="Thêm tên nhân viên"
            onChange={(e) => {
              setNextFullName(e.target.value);
            }}
            name="fullName"
          />
          <label htmlFor="username">Tài khoản nhân viên: </label>
          <Input
            value={nextUsername}
            type="text"
            placeholder="Thêm tài khoản nhân viên"
            onChange={(e) => {
              setNextUsername(e.target.value);
            }}
            name="username"
          />
          <label htmlFor="password">Mật khẩu nhân viên: </label>
          <Input
            value={nextPassword}
            type="text"
            placeholder="Thêm tên mật khẩu nhân viên"
            onChange={(e) => {
              setNextPassword(e.target.value);
            }}
            name="password"
          />
          <label htmlFor="phone-number">Số điện thoại nhân viên: </label>
          <Input
            value={nextPhoneNumber}
            type="text"
            placeholder="Thêm số điện thoại nhân viên"
            onChange={(e) => {
              setNextPhoneNumber(e.target.value);
            }}
            name="phone-number"
          />
          <Radio.Group
            onChange={(e) => {
              setNextGender(e.target.value);
            }}
            value={nextGender}
          >
            <Radio value={1}>Nam</Radio>
            <Radio value={0}>Nữ</Radio>
          </Radio.Group>
          <Radio.Group
            onChange={(e) => {
              setNextIsActive(e.target.value);
            }}
            value={nextIsActive}
          >
            <Radio value={true}>Hoạt động</Radio>
            <Radio value={false}>Không hoạt động</Radio>
          </Radio.Group>
          <label htmlFor="role">Vai trò</label>
          <select
            value={nextRole}
            id="category"
            name="category"
            onChange={(e) => {
              setNextRole(e.target.value);
            }}
          >
            <option value="" disabled selected>
              Chọn vai trò
            </option>
            {roles &&
              roles.map((role: Role) => {
                return (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                );
              })}
          </select>
        </div>
      </Modal>
    </div>
  );
}

export default ManageStaff;
