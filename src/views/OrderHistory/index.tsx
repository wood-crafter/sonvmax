import { useMemo, useState } from "react";
import "./index.css";
import { Table, notification, Spin, Modal } from "antd";
import type { ColumnType } from "antd/es/table";
import { Order } from "../../type";
import { NumberToVND } from "../../helper";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useOrders } from "../../hooks/useOrder";

function OrderHistory() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading, mutate: refreshOrder } = useOrders();
  const orders = useMemo(
    () => data?.data.map((it) => ({ key: it.id, ...it })),
    [data?.data]
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
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record: Order) => {
        return <div>{statusToText(record.status)}</div>;
      },
      sorter: (a, b) => a.status - b.status,
    },
  ];

  if (isLoading) return <Spin />;

  return (
    <div className="OrderHistory">
      {contextHolder}
      <Table columns={columns} dataSource={orders} />
    </div>
  );
}

export default OrderHistory;
