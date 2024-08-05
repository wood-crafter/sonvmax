/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import "./index.css";
import {
  Table,
  notification,
  Spin,
  Space,
  Popconfirm,
  Button,
  Modal,
} from "antd";
import type { ColumnType } from "antd/es/table";
import { Order } from "../../type";
import { NumberToVND } from "../../helper";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useOrders } from "../../hooks/useOrder";
import { QuestionCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { API_ROOT } from "../../constant";
import { requestOptions } from "../../hooks/useProduct";

function OrderHistory() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading } = useOrders();
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const orders = useMemo(
    () => data?.data.map((it) => ({ key: it.id, ...it })),
    [data?.data]
  );

  const cloneCartSuccess = () => {
    api.open({
      message: "Tạo lại đơn hàng thành công",
      description: "Đơn hàng đã tạo",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const cloneCartFail = () => {
    api.open({
      message: "Tạo lại đơn hàng lỗi",
      description: "Đơn hàng lỗi một phần",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const handleReAddToCart = async (order: Order) => {
    const orderPromises: Promise<Response>[] = [];
    order.orderProductSnapshots.forEach((it) => {
      const cartBody = {
        quantity: it.quantity,
        colorId: it.colorId,
      };

      orderPromises.push(
        authFetch(`${API_ROOT}/order/create-order-product/${it.productId}`, {
          ...requestOptions,
          body: JSON.stringify(cartBody),
          method: "POST",
          headers: {
            ...requestOptions.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
    });

    Promise.allSettled(orderPromises).then((results) => {
      const allSuccessful = results.every(
        (result) => result.status === "fulfilled"
      );

      if (allSuccessful) {
        cloneCartSuccess();
      } else {
        cloneCartFail();
      }
    });
  };

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
    {
      title: "",
      key: "action",
      render: (_, record: Order) => (
        <Space size="middle">
          <Popconfirm
            title="Thêm lại vào giỏ"
            description="Bạn chắc chắn muốn thêm lại vào giỏ?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleReAddToCart(record)}
            okText="Thêm"
            cancelText="Huỷ"
          >
            <Button>Mua lại</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const orderColumns: ColumnType<any>[] = [
    {
      title: "Tên sản phẩm",
      key: "productDetails",
      render: (record) => {
        return <div>{record.productDetails.productName}</div>;
      },
    },
    {
      title: "Ảnh sản phẩm",
      key: "image",
      render: (record) => {
        return (
          <div style={{ maxHeight: "80%", maxWidth: "8rem" }}>
            <img
              src={record.productDetails.image}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        );
      },
    },
    {
      title: "Giá",
      key: "price",
      render: (record) => {
        return <div>{NumberToVND.format(record.price)}</div>;
      },
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (record) => {
        return <div>{record.quantity}</div>;
      },
    },
  ];

  if (isLoading) return <Spin />;

  return (
    <div className="OrderHistory">
      {contextHolder}
      <Table
        columns={columns}
        dataSource={orders}
        onRow={(record) => ({
          onDoubleClick: () => {
            setCurrentOrder(record.orderProductSnapshots);
          },
        })}
      />
      <Modal
        title="Xem chi tiết đơn"
        open={!!currentOrder}
        onOk={() => setCurrentOrder(null)}
        onCancel={() => setCurrentOrder(null)}
        width={"100%"}
      >
        <Table columns={orderColumns} dataSource={currentOrder} />
      </Modal>
    </div>
  );
}

export default OrderHistory;
