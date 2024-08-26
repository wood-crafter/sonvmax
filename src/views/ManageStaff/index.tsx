import { useRef, useState } from "react";
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
  Select,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  QuestionCircleOutlined,
  FrownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Role, Staff } from "../../type";
import { useStaffs } from "../../hooks/useStaff";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { API_ROOT } from "../../constant";
import { useRoles } from "../../hooks/useRoles";
import { requestOptions } from "../../hooks/utils";
import type { InputRef } from "antd";

type UpdateData = {
  gender: number;
  isActive: boolean;
  roleId?: string;
  email: string;
};

function ManageStaff() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: rolesResponse } = useRoles(1);
  const { data, mutate: refreshStaffs } = useStaffs(1);
  const staffs = data?.data ?? [];
  const roles = rolesResponse?.data;
  const searchInput = useRef<InputRef | null>(null);

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
  const [email, setEmail] = useState<string>("");

  const [nextFullName, setNextFullName] = useState("");
  const [nextPhoneNumber, setNextPhoneNumber] = useState("");
  const [nextIsActive, setNextIsActive] = useState(false);
  const [nextGender, setNextGender] = useState(0);
  const [nextUsername, setNextUsername] = useState("");
  const [nextEmail, setNextEmail] = useState("");
  const [nextRole, setNextRole] = useState<string>("");

  const [currentEditing, setCurrentEditing] = useState<Staff | null>(null);
  const handleUpdateAgent = async () => {
    const updateData: UpdateData = {
      email: email,
      gender: +gender,
      isActive: isActive,
    };

    if (role) {
      updateData.roleId = role;
    }
    const updateBody = JSON.stringify(updateData);

    const updateRes = await authFetch(
      `${API_ROOT}/staff/update-staff/${currentEditing?.id}`,
      {
        ...requestOptions,
        body: updateBody,
        method: "PUT",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (updateRes.ok) {
      api.open({
        message: "Tạo thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    } else {
      api.open({
        message: "Tạo thất bại",
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Staff) => {
    setGender(record.gender);
    setIsActive(record.isActive);
    setEmail(record.email);
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
    setNextEmail("");
    setNextGender(0);
    setNextIsActive(false);
    setNextPhoneNumber("");
    setNextRole(roles ? roles[0].id : "");
  };

  const handleAddOk = async () => {
    if (
      !nextFullName ||
      !nextUsername ||
      !nextEmail ||
      !nextPhoneNumber ||
      !nextRole
    ) {
      missingAddPropsNotification();
      return;
    }
    const staffToAdd = JSON.stringify({
      roleId: nextRole,
      username: nextUsername,
      email: nextEmail,
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder="Tìm họ và tên"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Bỏ lựa chọn
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.fullName.toLowerCase().includes((value as string).toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      sorter: (a, b) => {
        if (!a.isActive && b.isActive) return -1;
        return 1;
      },
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Tạm dừng", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: number) => <div>{gender === 1 ? "Nam" : "Nữ"}</div>,
      sorter: (a, b) => a.gender - b.gender,
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      render: (value: string) => (
        <div>{roles?.find((it) => it.id === value)?.name}</div>
      ),
      sorter: (a, b) => a.roleId.localeCompare(b.roleId),
    },
    {
      title: "",
      key: "action",
      render: (_, record: Staff) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xoá nhân viên"
            description="Bạn chắc chắn muốn xoá nhân viên này?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteRecord(record)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ManageStaff">
      {contextHolder}
      <h2 style={{ color: "black" }}>Quản lý nhân viên</h2>
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
            <label htmlFor="fullName" style={{ display: "flex" }}>
              Họ và tên nhân viên:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              style={{ backgroundColor: "rgb(220, 220, 220)" }}
              value={currentEditing?.fullName}
              type="text"
              name="fullName"
              readOnly
            />
            <label htmlFor="username" style={{ display: "flex" }}>
              Tên đăng nhập:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              value={currentEditing?.username}
              style={{ backgroundColor: "rgb(220, 220, 220)" }}
              type="text"
              name="username"
              readOnly
            />
            <label htmlFor="username" style={{ display: "flex" }}>
              Email: <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              value={email}
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
            <label htmlFor="role" style={{ display: "flex" }}>
              Vai trò:
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Select
              value={role}
              id="role"
              onChange={(value) => {
                setRole(value);
              }}
            >
              {roles?.map((role: Role) => {
                if (role.name !== "AGENT") {
                  return (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  );
                }
              })}
            </Select>
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
          <label htmlFor="fullName" style={{ display: "flex" }}>
            Tên đầy đủ nhân viên:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={nextFullName}
            type="text"
            placeholder="Thêm tên nhân viên"
            onChange={(e) => {
              setNextFullName(e.target.value);
            }}
            name="fullName"
          />
          <label htmlFor="username" style={{ display: "flex" }}>
            Tài khoản nhân viên:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={nextUsername}
            type="text"
            placeholder="Thêm tài khoản nhân viên"
            onChange={(e) => {
              setNextUsername(e.target.value);
            }}
            name="username"
          />
          <label htmlFor="nextEmail" style={{ display: "flex" }}>
            Email nhân viên:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={nextEmail}
            type="text"
            placeholder="Thêm email nhân viên"
            onChange={(e) => {
              setNextEmail(e.target.value);
            }}
            name="nextEmail"
          />
          <label htmlFor="phone-number" style={{ display: "flex" }}>
            Số điện thoại nhân viên:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
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
          <label htmlFor="role" style={{ display: "flex" }}>
            Vai trò<div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Select
            value={nextRole}
            id="role"
            onChange={(value) => {
              setNextRole(value);
            }}
          >
            <Select.Option value="" disabled selected>
              Chọn vai trò
            </Select.Option>
            {roles &&
              roles.map((role: Role) => {
                if (role.name !== "AGENT") {
                  return (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  );
                }
              })}
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default ManageStaff;
