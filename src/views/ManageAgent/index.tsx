/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import "./index.css";
import {
  Table,
  Space,
  Button,
  Modal,
  notification,
  Input,
  Popconfirm,
  Select,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  QuestionCircleOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { Agent } from "../../type";
import { useAgents } from "../../hooks/useAgent";
import { NumberToVND } from "../../helper";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { API_ROOT } from "../../constant";
import { useRoles } from "../../hooks/useRoles";
import { useSales } from "../../hooks/useStaff";
import { requestOptions } from "../../hooks/utils";

const { Option } = Select;

function ManageAgent() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const roleName = useUserStore((state) => state.roleName);
  const [api, contextHolder] = notification.useNotification();
  const { data: rolesResponse } = useRoles(1);
  const { data, mutate: refreshAgents } = useAgents(1, 9999);
  const { data: salesResponse } = useSales(1, 9999);
  const sales = salesResponse?.data;
  const agents = data?.data ?? [];
  const roles = rolesResponse?.data;

  const missingAddPropsNotification = () => {
    api.open({
      message: "Tạo thất bại",
      description: "Vui lòng điền đủ thông tin",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const addSuccessNotification = () => {
    api.open({
      message: "Tạo thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const updateSuccessNotification = () => {
    api.open({
      message: "Sửa thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const updateFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Sửa thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const deleteSuccessNotification = () => {
    api.open({
      message: "Xoá thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const deleteFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Xoá thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const addFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Tạo thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const [debitLimit, setDebitLimit] = useState<string>("");
  const [accountDebit, setAccountDebit] = useState<string>("");
  const [accountHave, setAccountHave] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [sale, setSale] = useState<string>("");

  const [nextAgentFullName, setNextAgentFullName] = useState("");
  const [nextAgentEmail, setNextAgentEmail] = useState("");
  const [nextAgentUsername, setNextAgentUsername] = useState("");
  const [nextAgentAddress, setNextAgentAddress] = useState("");
  const [nextAgentPhoneNumber, setNextAgentPhoneNumber] = useState("");
  const [nextAgentName, setNextAgentName] = useState("");
  const [nextAgentTaxCode, setNextAgentTaxCode] = useState("");
  const [nextRank, setNextRank] = useState<string>("");
  const [nextSale, setNextSale] = useState<string>("");
  const nextDebitLimit = useMemo(() => {
    if (+nextRank === 1) return 100000000;
    if (+nextRank === 2) return 50000000;
    if (+nextRank === 3) return 30000000;
    return 0;
  }, [nextRank]);

  const [currentEditing, setCurrentEditing] = useState<Agent | null>(null);
  const handleUpdateAgent = async () => {
    const updateData: any = {
      ...currentEditing,
      roleId: roles?.find((it) => it.name === "AGENT")?.id,
      debitLimit: +debitLimit,
      accountDebit: +accountDebit,
      accountHave: +accountHave,
      rank: +rank,
    };

    if (sale) {
      updateData.staffId = sale;
    }
    const updateBody = JSON.stringify(updateData);

    const updateResponse = await authFetch(
      `${API_ROOT}/agent/update-agent/${currentEditing?.id}`,
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

    if (updateResponse.ok) {
      updateSuccessNotification();
      refreshAgents();
    } else {
      updateFailNotification(updateResponse.status, updateResponse.statusText);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Agent) => {
    setCurrentEditing(record);
    reAddingUpdateProps(record);
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    await handleUpdateAgent();
    refreshAgents();
    setIsModalOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRecord = async (record: Agent) => {
    const deleteResponse = await authFetch(
      `${API_ROOT}/agent/remove-agent/${record.id}`,
      {
        ...requestOptions,
        method: "DELETE",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (deleteResponse.ok) {
      deleteSuccessNotification();
    } else {
      deleteFailNotification(deleteResponse.status, deleteResponse.statusText);
    }
    refreshAgents();
  };

  const clearAddInput = () => {
    setNextAgentFullName("");
    setNextAgentName("");
    setNextAgentUsername("");
    setNextAgentAddress("");
    setNextAgentPhoneNumber("");
    setNextAgentTaxCode("");
    setNextAgentEmail("");
    setNextRank("");
    setNextSale("");
  };

  const handleAddOk = async () => {
    if (
      !nextAgentFullName ||
      !nextAgentEmail ||
      !nextAgentName ||
      !nextAgentUsername ||
      !nextAgentPhoneNumber ||
      !nextRank ||
      !nextSale
    ) {
      missingAddPropsNotification();
      return;
    }
    const agentToAdd = JSON.stringify({
      email: nextAgentEmail,
      username: nextAgentUsername,
      password: "",
      rank: +nextRank,
      fullName: nextAgentFullName,
      agentName: nextAgentName,
      address: nextAgentAddress,
      taxCode: nextAgentTaxCode,
      phoneNumber: nextAgentPhoneNumber,
      staffId: nextSale,
    });

    const createResponse = await authFetch(
      `${API_ROOT}/agent/create-agent/${
        roles?.find((it) => it.name === "AGENT")?.id
      }`,
      {
        ...requestOptions,
        body: agentToAdd,
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
      refreshAgents();
      clearAddInput();
    }
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleSetNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      setter(inputValue);
    }
  };

  const columns: ColumnType<Agent>[] = useMemo(() => {
    return [
      {
        title: "Tên đại lý",
        dataIndex: "agentName",
        key: "agentName",
        sorter: (a, b) => a.agentName.localeCompare(b.agentName),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Công nợ tối đa",
        dataIndex: "debitLimit",
        key: "debitLimit",
        render: (debitLimit: number) => (
          <div>{NumberToVND.format(debitLimit)}</div>
        ),
        sorter: (a, b) => a.debitLimit - b.debitLimit,
      },
      {
        title: "Công nợ hiện tại",
        dataIndex: "accountDebit",
        key: "accountDebit",
        render: (accountDebit: number) => (
          <div>{NumberToVND.format(accountDebit)}</div>
        ),
        sorter: (a, b) => a.accountDebit - b.accountDebit,
      },
      {
        title: "Tài khoản hiện có",
        dataIndex: "accountHave",
        key: "accountHave",
        render: (accountHave: number) => (
          <div>{NumberToVND.format(accountHave)}</div>
        ),
        sorter: (a, b) => a.accountHave - b.accountHave,
      },
      ...(roleName !== "SALES"
        ? [
            {
              title: "Nhân viên quản lý",
              dataIndex: "staffId",
              key: "staffId",
              render: (_: any, record: Agent) => (
                <div>
                  {sales?.find((it) => it.id === record.staffId)?.fullName}
                </div>
              ),
            },
          ]
        : []),
      {
        title: "Cấp đại lý",
        dataIndex: "rank",
        key: "rank",
        sorter: (a, b) => a.rank - b.rank,
      },
      ...(roleName !== "SALES"
        ? [
            {
              title: "",
              key: "action",
              render: (_: any, record: Agent) => (
                <Space size="middle">
                  <Button
                    onClick={() => {
                      showModal(record);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xoá đại lý"
                    description="Bạn chắc chắn muốn xoá đại lý này?"
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
          ]
        : []),
    ];
  }, [roleName, sales]);

  const reAddingUpdateProps = (record: Agent) => {
    setDebitLimit(record?.debitLimit + "");
    setAccountDebit(record?.accountDebit + "");
    setAccountHave(record?.accountHave + "");
    setRank(record?.rank + "");
    setSale(record?.staffId ?? "");
  };

  return (
    <div className="ManageAgent">
      {contextHolder}
      <h2>Quản lý đại lý</h2>
      {roleName !== "SALES" && (
        <Button
          onClick={() => {
            setIsAddModalOpen(true);
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Thêm đại lý
        </Button>
      )}
      <Table columns={columns} dataSource={agents} />
      <Modal
        title="Sửa thông tin khách hàng"
        open={isModalOpen}
        onOk={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      >
        {currentEditing && (
          <div className="modal-update-container">
            <label htmlFor="agent-email" style={{ display: "flex" }}>
              Email đại lý:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              style={{ backgroundColor: "rgb(220, 220, 220)" }}
              value={currentEditing?.email}
              type="text"
              name="agent-email"
              readOnly
            />
            <label htmlFor="debitLimit" style={{ display: "flex" }}>
              Công nợ tối đa:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              name="debitLimit"
              value={debitLimit}
              onChange={(e) => {
                handleSetNumberInput(e, setDebitLimit);
              }}
              placeholder={currentEditing.debitLimit.toString()}
              maxLength={16}
            />
            <label htmlFor="accountDebit" style={{ display: "flex" }}>
              Dư nợ hiện tại:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              name="accountDebit"
              value={accountDebit}
              onChange={(e) => {
                handleSetNumberInput(e, setAccountDebit);
              }}
              placeholder={currentEditing.accountDebit.toString()}
              maxLength={16}
            />
            <label htmlFor="accountHave" style={{ display: "flex" }}>
              Tài khoản hiện có:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Input
              name="accountHave"
              value={accountHave}
              onChange={(e) => {
                handleSetNumberInput(e, setAccountHave);
              }}
              placeholder={currentEditing.accountHave.toString()}
              maxLength={16}
            />
            <label htmlFor="rank" style={{ display: "flex" }}>
              Cấp đại lý:{" "}
              <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
            </label>
            <Select
              value={rank}
              onChange={(value) => setRank(value)}
              placeholder={currentEditing.rank.toString()}
              style={{ width: "100%" }}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>

            {sales && sales.length && (
              <>
                <label htmlFor="sales" style={{ display: "flex" }}>
                  Nhân viên quản lý:{" "}
                  <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
                </label>
                <Select
                  value={sale}
                  onChange={(value) => setSale(value)}
                  style={{ width: "100%" }}
                >
                  {sales.map((sale) => (
                    <Option key={sale.id} value={sale.id}>
                      {sale.fullName}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="Thêm đại lý"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <div className="modal-update-container">
          <label htmlFor="agent-fullname" style={{ display: "flex" }}>
            Tên người đại diện:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={nextAgentFullName}
            type="text"
            placeholder="Thêm tên người đại diện"
            onChange={(e) => {
              setNextAgentFullName(e.target.value);
            }}
            name="agent-fullname"
          />
          <label htmlFor="agent-email" style={{ display: "flex" }}>
            Email đại lý:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>{" "}
          </label>
          <Input
            value={nextAgentEmail}
            type="text"
            placeholder="Thêm email đại lý"
            onChange={(e) => {
              setNextAgentEmail(e.target.value);
            }}
            name="agent-email"
          />
          <label htmlFor="agent-username" style={{ display: "flex" }}>
            Tên đăng nhập đại lý:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>{" "}
          </label>
          <Input
            value={nextAgentUsername}
            type="text"
            placeholder="Thêm tên tài khoản đại lý"
            onChange={(e) => {
              setNextAgentUsername(e.target.value);
            }}
            name="agent-username"
          />
          <label htmlFor="agent-address" style={{ display: "flex" }}>
            Địa chỉ đại lý:
          </label>
          <Input
            value={nextAgentAddress}
            type="text"
            placeholder="Thêm địa chỉ đại lý"
            onChange={(e) => {
              setNextAgentAddress(e.target.value);
            }}
            name="agent-address"
          />
          <label htmlFor="agent-phone-number" style={{ display: "flex" }}>
            Số điện thoại đại lý:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>{" "}
          </label>
          <Input
            value={nextAgentPhoneNumber}
            type="text"
            placeholder="Thêm số điện thoại"
            onChange={(e) => {
              setNextAgentPhoneNumber(e.target.value);
            }}
            name="agent-phone-number"
          />
          <label htmlFor="agent-name" style={{ display: "flex" }}>
            Tên đại lý:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>{" "}
          </label>
          <Input
            value={nextAgentName}
            type="text"
            placeholder="Thêm tên đại lý"
            onChange={(e) => {
              setNextAgentName(e.target.value);
            }}
            name="agent-name"
          />
          <label htmlFor="agent-tax-code" style={{ display: "flex" }}>
            Mã số thuế đại lý:
          </label>
          <Input
            value={nextAgentTaxCode}
            type="text"
            placeholder="Thêm tên đại lý"
            onChange={(e) => {
              setNextAgentTaxCode(e.target.value);
            }}
            name="agent-tax-code"
          />
          <label htmlFor="rank" style={{ display: "flex" }}>
            Cấp đại lý:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>{" "}
          </label>
          <Select
            value={nextRank}
            onChange={(value) => setNextRank(value)}
            style={{ width: "100%" }}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
          </Select>
          <label htmlFor="debit-limit" style={{ display: "flex" }}>
            Công nợ tối đa:
          </label>
          <Input
            name="debit-limit"
            placeholder={`${NumberToVND.format(nextDebitLimit)}`}
            disabled
            maxLength={16}
          />
          {sales && sales.length && (
            <>
              <label htmlFor="sales" style={{ display: "flex" }}>
                Nhân viên quản lý:{" "}
                <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>{" "}
              </label>
              <Select
                value={nextSale}
                onChange={(value) => setNextSale(value)}
                style={{ width: "100%" }}
              >
                {sales.map((sale) => (
                  <Option key={sale.id} value={sale.id}>
                    {sale.fullName}
                  </Option>
                ))}
              </Select>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ManageAgent;
