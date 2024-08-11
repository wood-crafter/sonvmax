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
  Select,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  QuestionCircleOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { Voucher } from "../../type";
import { requestOptions } from "../../hooks/utils";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { API_ROOT } from "../../constant";
import { useVouchers } from "../../hooks/useVoucher";
import { useAgents } from "../../hooks/useAgent";

function ManageVoucher() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading, mutate: refreshVouchers } = useVouchers(1);
  const { data: agents } = useAgents(1);
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
  const [agent, setAgent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(1);

  const [nextCode, setNextCode] = useState("");
  const [nextDiscountAmount, setNextDiscountAmount] = useState(1);
  const [nextIsActive, setNextIsActive] = useState(true);
  const [nextAgent, setNextAgent] = useState("");

  const [currentEditing, setCurrentEditing] = useState<Voucher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleUpdateVoucher = async () => {
    if (!code || discountAmount <= 0 || !agent) {
      missingAddPropsNotification();
      return;
    }

    const updateData = {
      code: code,
      discountAmount: +discountAmount,
      activeVoucher: isActive,
      agentId: agent,
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

  const showModal = (record: Voucher) => {
    setCurrentEditing(record);
    setCode(record.code);
    setDiscountAmount(record.discountAmount);
    setIsActive(record.activeVoucher);
    setAgent(record.agentId ?? "");
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
    setNextAgent("");
  };

  const handleAddOk = async () => {
    if (
      !nextCode ||
      nextDiscountAmount < 5 ||
      nextDiscountAmount > 15 ||
      !nextAgent
    ) {
      missingAddPropsNotification();
      return;
    }
    const voucherToAdd = JSON.stringify({
      code: nextCode,
      discountAmount: nextDiscountAmount,
      activeVoucher: nextIsActive,
      agentId: nextAgent,
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
      render: (discountAmount) => <div>{discountAmount}%</div>,
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
      title: "Đại lý thụ hưởng",
      dataIndex: "agentId",
      key: "agentId",
      render: (_, record: Voucher) => (
        <div>
          {agents?.data.find((agent) => agent.id === record.agentId)
            ?.agentName ?? "--"}
        </div>
      ),
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
        okText="OK"
        cancelText="Huỷ"
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
              min={5}
              max={15}
              placeholder="Nhập phần trăm giảm từ 5 đến 15"
              name="discountAmount"
              onChange={(e) => {
                let value = +e.target.value;
                if (value < 5) value = 5;
                if (value > 15) value = 15;
                setDiscountAmount(value);
              }}
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
            <label htmlFor="agent">Đại lý thụ hưởng: </label>
            <Select
              value={agent}
              onChange={(value) => setAgent(value)}
              placeholder="Chọn đại lý thụ hưởng"
              style={{ width: "100%" }}
            >
              {agents?.data.map((agent) => (
                <Select.Option key={agent.id} value={agent.id}>
                  {agent.agentName}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
      </Modal>

      <Modal
        title="Thêm voucher"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        okText="OK"
        cancelText="Huỷ"
      >
        <div className="modal-update-container">
          <label htmlFor="code">Mã voucher: </label>
          <Input
            value={nextCode}
            type="text"
            placeholder="Thêm tên mã voucher"
            onChange={(e) => setNextCode(e.target.value)}
            name="code"
          />
          <label htmlFor="discountAmount">Phần trăm giảm: </label>
          <Input
            value={nextDiscountAmount}
            type="number"
            min={5}
            max={15}
            placeholder="Nhập phần trăm giảm từ 5 đến 15"
            onChange={(e) => {
              let value = +e.target.value;
              if (value < 5) value = 5;
              if (value > 15) value = 15;
              setNextDiscountAmount(value);
            }}
            name="discountAmount"
          />
          <Radio.Group
            onChange={(e) => setNextIsActive(e.target.value)}
            value={nextIsActive}
          >
            <Radio value={true}>Hoạt động</Radio>
            <Radio value={false}>Ngừng</Radio>
          </Radio.Group>
          <label htmlFor="agent">Đại lý thụ hưởng: </label>
          <Select
            value={nextAgent}
            onChange={(value) => setNextAgent(value)}
            placeholder="Chọn đại lý thụ hưởng"
            style={{ width: "100%" }}
          >
            {agents?.data.map((agent) => (
              <Select.Option key={agent.id} value={agent.id}>
                {agent.agentName}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}

export default ManageVoucher;
