/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import "./index.css";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { useTransaction } from "../../hooks/useTransaction";
import { Transaction } from "../../type";
import Table, { ColumnType } from "antd/es/table";
import { notification, Button, Dropdown, Input, Menu, Space } from "antd";
import { NumberToVND } from "../../helper";
import {
  SmileOutlined,
  FrownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { API_ROOT } from "../../constant";

function ManageTransaction() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: transaction, mutate: refreshTransaction } = useTransaction(1);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const handleStatusChange = async (id: string, newStatus: number) => {
    const response = await authFetch(
      `${API_ROOT}/transaction/update-status/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (response.ok) {
      api.open({
        message: "Cập nhật trạng thái thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshTransaction();
    } else {
      api.open({
        message: "Cập nhật trạng thái thất bại",
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const saveDescription = async (record: Transaction) => {
    const response = await authFetch(
      `${API_ROOT}/transaction/update-transaction/${record.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      }
    );

    if (response.ok) {
      api.open({
        message: "Cập nhật ghi chú thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      setEditingKey(null);
      refreshTransaction();
    } else {
      api.open({
        message: "Cập nhật ghi chú thất bại",
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
  };

  const columns = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(transaction?.data.map((item) => item.agentId))
    );
    const agentNameFilters = uniqueNames.map((id) => ({
      text: transaction?.data.find((it) => it.agentId === id)?.agentFullName,
      value: id,
    }));

    const columns: ColumnType<Transaction>[] = [
      {
        title: "Mã phiếu",
        dataIndex: "id",
        key: "id",
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Tìm mã phiếu"
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
          record.id.toString().includes((value as string).toLowerCase()),
      },
      {
        title: "Tên khách hàng",
        dataIndex: "agentFullName",
        key: "agentFullName",
        filters: agentNameFilters,
        onFilter: (value, record) => record.agentId === value,
      },
      {
        title: "Tổng nạp",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (totalAmount: number) => (
          <div>{NumberToVND.format(totalAmount)}</div>
        ),
        sorter: (a: Transaction, b: Transaction) =>
          +a.totalAmount - +b.totalAmount,
        sortDirections: ["ascend", "descend"],
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: (a: Transaction, b: Transaction) => {
          const parseDate = (dateStr: string) => {
            const [time, dayMonthYear] = dateStr.split(" ");
            const [day, month, year] = dayMonthYear.split("/").map(Number);
            const [hours, minutes, seconds] = time.split(":").map(Number);

            return new Date(
              year,
              month - 1,
              day,
              hours,
              minutes,
              seconds
            ).getTime();
          };

          const dateA = parseDate(a?.createdAt || "");
          const dateB = parseDate(b?.createdAt || "");
          return dateA - dateB;
        },
        sortDirections: ["ascend", "descend"],
      },
      {
        title: "Ghi chú",
        dataIndex: "description",
        key: "description",
        render: (_, record: Transaction) => {
          return editingKey === record.id ? (
            <Input
              value={description}
              onChange={handleDescriptionChange}
              style={{ marginBottom: "10px" }}
            />
          ) : (
            <div>{record.description || ""}</div>
          );
        },
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record: Transaction) => {
          if (record.status === -1) return;
          return editingKey === record.id ? (
            <div style={{ display: "flex" }}>
              <Button
                onClick={() => saveDescription(record)}
                style={{ marginRight: "10px" }}
              >
                OK
              </Button>
              <Button onClick={() => setEditingKey(null)}>Hủy</Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                setEditingKey(record.id);
                setDescription(record.description || "");
              }}
            >
              Sửa
            </Button>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: number, record: Transaction) => {
          let statusText: React.ReactNode;

          switch (status) {
            case 1:
              statusText = <span style={{ color: "green" }}>Xác nhận</span>;
              break;
            case -1:
              statusText = <span style={{ color: "red" }}>Hủy bỏ</span>;
              break;
            case 0:
              statusText = (
                <Dropdown
                  overlay={
                    <Menu
                      onClick={({ key }) =>
                        handleStatusChange(record.id, Number(key))
                      }
                      items={[
                        {
                          key: "1",
                          label: (
                            <span style={{ color: "green" }}>Xác nhận</span>
                          ),
                        },
                        {
                          key: "-1",
                          label: <span style={{ color: "red" }}>Hủy bỏ</span>,
                        },
                      ]}
                    />
                  }
                  trigger={["click"]}
                >
                  <Button style={{ color: "orange" }}>Chờ xác nhận</Button>
                </Dropdown>
              );
              break;
            default:
              statusText = <span>Không xác định</span>;
          }

          return statusText;
        },
        filters: [
          { text: "Chờ xác nhận", value: 0 },
          { text: "Xác nhận", value: 1 },
          { text: "Hủy bỏ", value: -1 },
        ],
        onFilter: (value, record) => record.status === value,
      },
    ];

    return columns;
  }, [description, editingKey, transaction?.data]);

  return (
    <div className="ManageTransaction">
      <h3>Quản lý phiếu nạp tiền</h3>
      {contextHolder}
      <Table columns={columns} dataSource={transaction?.data} />
    </div>
  );
}

export default ManageTransaction;
