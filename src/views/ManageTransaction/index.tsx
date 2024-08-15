/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import "./index.css";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { useTransaction } from "../../hooks/useTransaction";
import { Transaction } from "../../type";
import Table, { ColumnType } from "antd/es/table";
import { notification, Button, Dropdown, Input, Menu } from "antd";
import { NumberToVND } from "../../helper";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
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

  const columns: ColumnType<Transaction>[] = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "agentName",
      key: "agentName",
    },
    {
      title: "Tổng nạp",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount: number) => (
        <div>{NumberToVND.format(totalAmount)}</div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
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
                        label: <span style={{ color: "green" }}>Xác nhận</span>,
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
    },
  ];

  return (
    <div className="ManageTransaction">
      <h3>Quản lý phiếu nạp tiền</h3>
      {contextHolder}
      <Table columns={columns} dataSource={transaction?.data} />
    </div>
  );
}

export default ManageTransaction;
