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
  Spin,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  QuestionCircleOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { Voucher } from "../../type";
import { requestOptions } from "../../hooks/useStaff";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { API_ROOT } from "../../constant";
import { useVouchers } from "../../hooks/useVoucher";

function ManageVoucher() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading, mutate: refreshVouchers } = useVouchers(1);
  const voucher = data?.data ?? [];

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

  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [permissions, setPermissions] = useState(1);

  const [nextCode, setNextCode] = useState("");
  const [nextDiscountAmount, setNextDiscountAmount] = useState(0);
  const [nextIsActive, setNextIsActive] = useState(true);
  const [nextPermissions, setNextPermissions] = useState(1);

  const [currentEditing, setCurrentEditing] = useState<Voucher | null>(null);
  const handleUpdateVoucher = async () => {
    const updateData = {
      code: code,
      discountAmount: +discountAmount,
      activeVoucher: isActive,
      permissions: permissions,
    };
    const updateBody = JSON.stringify(updateData);

    await authFetch(
      `${API_ROOT}/voucher/update-voucher/${currentEditing?.id}`,
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
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Voucher) => {
    setCurrentEditing(record);
    setCode(record?.code);
    setDiscountAmount(record?.discountAmount);
    setIsActive(record?.activeVoucher);
    setPermissions(record?.permissions);
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    await handleUpdateVoucher();
    refreshVouchers();
    setIsModalOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRecord = async (record: Voucher) => {
    await authFetch(`${API_ROOT}/voucher/remove-voucher/${record.id}`, {
      ...requestOptions,
      method: "DELETE",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshVouchers();
  };

  const clearAddInput = () => {
    setNextCode("");
    setNextDiscountAmount(0);
    setNextIsActive(true);
    setNextPermissions(1);
  };

  const handleAddOk = async () => {
    if (!nextCode || !nextDiscountAmount) {
      missingAddPropsNotification();
      return;
    }
    const voucherToAdd = JSON.stringify({
      code: nextCode,
      discountAmount: nextDiscountAmount,
      activeVoucher: nextIsActive,
      permissions: nextPermissions,
    });

    const createResponse = await authFetch(
      `${API_ROOT}/voucher/create-voucher`,
      {
        ...requestOptions,
        body: voucherToAdd,
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
    refreshVouchers();
    clearAddInput();
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const columns: ColumnType<Voucher>[] = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Giá giảm",
      dataIndex: "discountAmount",
      key: "discountAmount",
      sorter: (a, b) => a.discountAmount - b.discountAmount,
    },
    {
      title: "Voucher hoạt động",
      dataIndex: "activeVoucher",
      key: "activeVoucher",
      render: (activeVoucher: boolean) => (
        <p style={{ color: activeVoucher ? "green" : "red" }}>
          {activeVoucher ? "Hoạt động" : "Tạm dừng"}
        </p>
      ),
      sorter: (a, b) => {
        if (!a.activeVoucher && b.activeVoucher) return -1;
        return 1;
      },
    },
    {
      title: "Chấp nhận",
      dataIndex: "permissions",
      key: "permissions",
      sorter: (a, b) => a.permissions - b.permissions,
    },
    {
      title: "",
      key: "action",
      render: (_, record: Voucher) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xoá voucher"
            description="Bạn chắc chắn muốn xoá voucher này?"
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

  if (isLoading) return <Spin />;

  return (
    <div className="ManageVoucher">
      {contextHolder}
      <Button
        onClick={() => {
          setIsAddModalOpen(true);
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm Voucher
      </Button>
      <Table columns={columns} dataSource={voucher} />
      <Modal
        title="Sửa thông tin voucher"
        open={isModalOpen}
        onOk={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      >
        {currentEditing && (
          <div className="modal-update-container">
            <label htmlFor="code">Mã voucher: </label>
            <Input
              value={code}
              type="text"
              name="code"
              onChange={(e) => setCode(e.target.value)}
            />
            <label htmlFor="discountAmount">Phần trăm giảm: </label>
            <Input
              value={discountAmount}
              type="number"
              min={0}
              max={100}
              name="discountAmount"
              onChange={(e) => setDiscountAmount(+e.target.value)}
            />
            <Radio.Group
              onChange={(e) => {
                setIsActive(e.target.value);
              }}
              value={isActive}
            >
              <Radio value={true}>Hoạt động</Radio>
              <Radio value={false}>Ngừng</Radio>
            </Radio.Group>
            <label htmlFor="permissions">Chấp nhận: </label>
            <Input
              value={permissions}
              type="text"
              name="permissions"
              onChange={(e) => setPermissions(+e.target.value)}
            />
          </div>
        )}
      </Modal>
      <Modal
        title="Thêm voucher"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <div className="modal-update-container">
          <label htmlFor="code">Mã voucher: </label>
          <Input
            value={nextCode}
            type="text"
            placeholder="Thêm tên mã voucher"
            onChange={(e) => {
              setNextCode(e.target.value);
            }}
            name="code"
          />
          <label htmlFor="discountAmount">Phần trăm giảm: </label>
          <Input
            value={nextDiscountAmount}
            type="number"
            placeholder="Nhập phần trăm giảm"
            onChange={(e) => {
              setNextDiscountAmount(+e.target.value);
            }}
            name="discountAmount"
          />
          <Radio.Group
            onChange={(e) => {
              setNextIsActive(e.target.value);
            }}
            value={nextIsActive}
          >
            <Radio value={true}>Hoạt động</Radio>
            <Radio value={false}>Ngừng</Radio>
          </Radio.Group>
          <label htmlFor="permissions">Chấp nhận: </label>
          <Input
            value={nextPermissions}
            type="text"
            name="permissions"
            onChange={(e) => setNextPermissions(+e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ManageVoucher;
