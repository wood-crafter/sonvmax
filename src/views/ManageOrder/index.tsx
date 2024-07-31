import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { Table, Space, Button, notification, Spin, Dropdown, Menu } from "antd";
import type { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  FrownOutlined,
  QuestionCircleOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Order } from "../../type";
import { NumberToVND } from "../../helper";
import { requestOptions } from "../../hooks/useProduct";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import { useOrders } from "../../hooks/useOrder";

type UpdateProps = {
  id: string;
  status?: number;
  description?: string;
  confirmBy?: string;
  voucherId?: string;
};

type UpdateOrderProps = {
  status?: number;
  description?: string;
  confirmBy?: string;
  voucherId?: string;
};

function ManageOrder() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading, mutate: refreshOrder } = useOrders();
  const orders = useMemo(
    () => data?.data.map((it) => ({ key: it.id, ...it })),
    [data?.data]
  );

  const updateOrder = async (UpdateProps: UpdateProps) => {
    const { id, status, description, confirmBy, voucherId } = UpdateProps;
    const updateOrderProps: UpdateOrderProps = {};

    if (typeof status === "number") {
      updateOrderProps.status = status;
    }

    if (description) {
      updateOrderProps.description = description;
    }

    if (confirmBy) {
      updateOrderProps.confirmBy = confirmBy;
    }

    if (confirmBy) {
      updateOrderProps.voucherId = voucherId;
    }

    const updateResponse = await authFetch(
      `${API_ROOT}/order/update-order/${id}`,
      {
        ...requestOptions,
        body: JSON.stringify(updateOrderProps),
        method: "PUT",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (updateResponse.ok) {
      refreshOrder();
    }
  };

  const getStatusMenu = (record: Order) => (
    <Menu>
      <Menu.Item
        key="0"
        icon={<UserOutlined />}
        onClick={() => updateOrder({ id: record.id, status: 0 })}
      >
        Đã đặt
      </Menu.Item>
      <Menu.Item
        key="1"
        icon={<UserOutlined />}
        onClick={() => updateOrder({ id: record.id, status: 1 })}
      >
        Xác nhận
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<UserOutlined />}
        onClick={() => updateOrder({ id: record.id, status: 2 })}
      >
        Đang chuẩn bị
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<UserOutlined />}
        onClick={() => updateOrder({ id: record.id, status: 3 })}
      >
        Đang giao
      </Menu.Item>
      <Menu.Item
        key="4"
        icon={<UserOutlined />}
        onClick={() => updateOrder({ id: record.id, status: 4 })}
      >
        Giao thành công
      </Menu.Item>
      <Menu.Item
        key="-1"
        icon={<UserOutlined />}
        onClick={() => updateOrder({ id: record.id, status: -1 })}
      >
        Huỷ bỏ
      </Menu.Item>
    </Menu>
  );

  const statusToText = (status: number) => {
    switch (status) {
      case 0:
        return "Đã đặt";
      case 1:
        return "Xác nhận";
      case 2:
        return "Đang chuẩn bị";
      case 3:
        return "Đang giao";
      case 4:
        return "Giao thành công";
      case -1:
        return "Huỷ bỏ";
    }
  };

  const columns: ColumnType<Order>[] = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (price: number) => <div>{NumberToVND.format(price)}</div>,
    },
    {
      title: "Chi tiết đơn",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Nhân viên duyệt",
      dataIndex: "confirmBy",
      key: "confirmBy",
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record: Order) => (
        <Space size="middle">
          <Dropdown overlay={getStatusMenu(record)}>
            <Button>
              <Space>
                {statusToText(record.status)}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin />;

  return (
    <div className="ManageOrder">
      {contextHolder}
      <Table columns={columns} dataSource={orders} />
    </div>
  );
}

export default ManageOrder;
