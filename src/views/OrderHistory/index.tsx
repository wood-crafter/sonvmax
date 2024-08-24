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
import {
  QuestionCircleOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { API_ROOT } from "../../constant";
import { requestOptions } from "../../hooks/utils";

function OrderHistory() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading, mutate: refreshOrders } = useOrders();
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [metadataOrder, setMetadataOrder] = useState<any>(null);
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
        rgb: it.colorPick,
        volumeId: it.volumeId,
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

  const handleCancelOrder = async (id: string) => {
    const updateResponse = await authFetch(
      `${API_ROOT}/order/update-order-status/${id}`,
      {
        ...requestOptions,
        body: JSON.stringify({ status: -1 }),
        method: "PUT",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (updateResponse.ok) {
      api.open({
        message: "Hủy đơn hàng",
        description: "Hủy đơn hàng thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshOrders();
    } else {
      api.open({
        message: "Hủy đơn hàng",
        description: "Hủy đơn hàng thất bại",
        icon: <FrownOutlined style={{ color: "#108ee9" }} />,
      });
    }
  };

  const statusToText = (status: number) => {
    switch (status) {
      case 0:
        return {
          text: "Đã đặt",
          color: "black",
        };
      case 1:
        return {
          text: "Xác nhận",
          color: "orange",
        };
      case 2:
        return {
          text: "Đang chuẩn bị",
          color: "blue",
        };
      case 3:
        return {
          text: "Đang giao",
          color: "purple",
        };
      case 4:
        return {
          text: "Giao thành công",
          color: "green",
        };
      case -1:
        return {
          text: "Huỷ bỏ",
          color: "red",
        };
    }
  };

  const columns: ColumnType<Order>[] = [
    {
      title: "Mã đơn hàng",
      key: "id",
      dataIndex: "id",
    },
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
        const status = statusToText(record.status);
        return <div style={{ color: status?.color }}>{status?.text}</div>;
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
          {record.status === 0 && (
            <Popconfirm
              title="Hủy đơn hàng"
              description="Bạn chắc chắn muốn hủy đơn hàng này?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleCancelOrder(record.id)}
              okText="Xác nhận"
              cancelText="Bỏ"
            >
              <Button style={{ color: "red" }}>Hủy đơn</Button>
            </Popconfirm>
          )}
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
      title: "Màu",
      key: "color",
      render: (record) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                border: "1px solid black",
                backgroundColor: `rgb(${
                  record?.colorDetails
                    ? record?.colorDetails.r
                    : record.colorPick?.r ?? 255
                }, ${
                  record?.colorDetails
                    ? record?.colorDetails.g
                    : record.colorPick?.g ?? 255
                }, ${
                  record?.colorDetails
                    ? record?.colorDetails.g
                    : record.colorPick?.b ?? 255
                })`,
              }}
            ></div>
            {record?.colorDetails && <div>{record?.colorDetails?.code}</div>}
          </div>
        );
      },
    },
    {
      title: "Quy cách đóng gói",
      key: "volume",
      render: (record) => {
        return <div>{record?.volumeDetails?.volume}</div>;
      },
    },
    {
      title: "Ngày mua",
      key: "createdAt",
      dataIndex: "createdAt",
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
            setMetadataOrder({
              address: record.address,
              phoneNumber: record.phoneNumber,
              addressCustom: record.addressCustom,
              phoneNumberCustom: record.phoneNumberCustom,
              id: record.id,
            });
          },
        })}
      />
      <Modal
        title={`Xem chi tiết đơn: ${metadataOrder?.id ?? ""}`}
        open={!!currentOrder}
        onOk={() => {
          setCurrentOrder(null);
          setMetadataOrder(null);
        }}
        onCancel={() => {
          setCurrentOrder(null);
          setMetadataOrder(null);
        }}
        width={"100%"}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            color: "red",
          }}
        >
          <div>
            <div>
              <strong>Địa chỉ: </strong>
              {metadataOrder?.addressCustom
                ? metadataOrder?.addressCustom
                : metadataOrder?.address}
            </div>
            <div>
              <strong>Số điện thoại:</strong>{" "}
              {metadataOrder?.phoneNumberCustom
                ? metadataOrder?.phoneNumberCustom
                : metadataOrder?.phoneNumber}
            </div>
          </div>
        </div>
        <Table columns={orderColumns} dataSource={currentOrder} />
      </Modal>
    </div>
  );
}

export default OrderHistory;
