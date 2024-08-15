import React from "react";
import { Table, Dropdown, Menu, Button, notification } from "antd";
import { ColumnType } from "antd/es/table";
import { useTransaction } from "../../hooks/useTransaction";
import { Transaction } from "../../type";
import "./index.css";
import { NumberToVND } from "../../helper";
import { API_ROOT } from "../../constant";
import { useUserStore } from "../../store/user";
import { requestOptions } from "../../hooks/utils";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";

function TransactionHistory() {
  const { data: transactions, mutate: refreshTransaction } = useTransaction(1);
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();

  const cancelTransaction = async (id: string) => {
    const response = await authFetch(
      `${API_ROOT}/transaction/update-status/${id}`,
      {
        ...requestOptions,
        method: "PATCH",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      api.open({
        message: "Hủy phiếu nạp tiền",
        description: "Hủy phiếu nạp tiền thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshTransaction();
    } else {
      api.open({
        message: "Hủy phiếu thất bại",
        description: "Hủy phiếu nạp tiền thất bại",
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
      title: "Tổng nạp",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount: string) => (
        <div>{NumberToVND.format(+totalAmount)}</div>
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
      render: (description: string) => <div>{description ?? ""}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number, record: Transaction) => {
        let statusText: string | React.ReactNode = "";
        let statusColor = "";
        let dropdown = null;

        switch (status) {
          case 1:
            statusText = "Thành công";
            statusColor = "green";
            break;
          case -1:
            statusText = "Hủy bỏ";
            statusColor = "red";
            break;
          case 0:
            statusText = (
              <Button style={{ color: "orange" }}>Chờ xác nhận</Button>
            );
            statusColor = "orange";
            dropdown = (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="cancel"
                      onClick={() => cancelTransaction(record.id)}
                      style={{ color: "red" }}
                    >
                      Hủy bỏ
                    </Menu.Item>
                  </Menu>
                }
                trigger={["hover"]}
              >
                <div>{statusText}</div>
              </Dropdown>
            );
            break;
          default:
            statusText = "Không xác định";
            statusColor = "grey";
        }

        return (
          <div className="status" style={{ color: statusColor }}>
            {dropdown || statusText}
          </div>
        );
      },
    },
  ];

  return (
    <div className="TransactionHistory">
      <h3>Lịch sử nạp tiền</h3>
      {contextHolder}
      <Table
        style={{ width: "100%" }}
        dataSource={transactions?.data}
        columns={columns}
      />
    </div>
  );
}

export default TransactionHistory;
