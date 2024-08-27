/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import "./index.css";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { useTransaction } from "../../hooks/useTransaction";
import { Transaction } from "../../type";
import Table, { ColumnType } from "antd/es/table";
import { notification, Button, Input, Space, Spin } from "antd";
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
  const {
    data: transaction,
    isLoading,
    mutate: refreshTransaction,
  } = useTransaction(1);
  const [isApiCalling, setIsApiCalling] = useState(false);

  const handleStatusChange = async (id: string, newStatus: number) => {
    setIsApiCalling(true);
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

    setIsApiCalling(false);
    if (response.ok) {
      api.open({
        message: "Cập nhật trạng thái thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshTransaction();
    } else {
      const resJson = await response.json();
      api.open({
        message: "Cập nhật trạng thái thất bại",
        description: resJson?.message,
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
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_: number, record: Transaction) => {
          if (record.status !== 0) return;
          return (
            <div style={{ display: "flex" }}>
              <Button
                onClick={() => {
                  handleStatusChange(record.id, 1);
                }}
                style={{ color: "green", marginRight: "0.2rem" }}
              >
                Đã nhận tiền
              </Button>
              <Button
                onClick={() => {
                  handleStatusChange(record.id, -1);
                }}
                style={{ color: "red" }}
              >
                Hủy bỏ
              </Button>
            </div>
          );
        },
        filters: [
          { text: "Chờ xác nhận", value: 0 },
          { text: "Xác nhận", value: 1 },
          { text: "Hủy bỏ", value: -1 },
        ],
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: number) => {
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
                <span style={{ color: "orange" }}>Chờ xác nhận</span>
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
  }, [transaction?.data]);

  if (isLoading) return <Spin size="large" />;
  return (
    <div className="ManageTransaction">
      <h3>Quản lý phiếu nạp tiền</h3>
      {contextHolder}
      <Spin spinning={isApiCalling}>
        <Table columns={columns} dataSource={transaction?.data} />
      </Spin>
    </div>
  );
}

export default ManageTransaction;
