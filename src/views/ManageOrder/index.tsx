/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import "./index.css";
import {
  Table,
  Space,
  Button,
  notification,
  Spin,
  Dropdown,
  Menu,
  Input,
  Popconfirm,
  Modal,
  InputRef,
} from "antd";
import type { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  FrownOutlined,
  DownOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Order } from "../../type";
import { NumberToVND } from "../../helper";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { ACCOUTANT, API_ROOT, SALES } from "../../constant";
import { useOrders } from "../../hooks/useOrder";
import { requestOptions } from "../../hooks/utils";
import { useAgents } from "../../hooks/useAgent";

type UpdateProps = {
  id: string;
  status?: number;
  description?: string;
};

type UpdateOrderProps = {
  status?: number;
  description?: string;
  confirmBy?: string;
  voucherId?: string;
};

function ManageOrder() {
  const accessToken = useUserStore((state) => state.accessToken);
  const roleName = useUserStore((state) => state.roleName);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, isLoading, mutate: refreshOrder } = useOrders();
  const searchInput = useRef<InputRef | null>(null);
  const orders = useMemo(
    () => data?.data.map((it) => ({ key: it.id, ...it })),
    [data?.data]
  );
  const { data: agentResponse } = useAgents(1, 9999);
  const agents = agentResponse?.data ?? [];

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agentName, setAgentName] = useState("");
  const [orderId, setOrderId] = useState("");

  const updateOrder = async (UpdateProps: UpdateProps) => {
    const { id, status, description } = UpdateProps;
    const updateOrderProps: UpdateOrderProps = {};

    let updateResponse;

    if (typeof status === "number") {
      updateOrderProps.status = status;
      updateResponse = await authFetch(
        `${API_ROOT}/order/update-order-status/${id}`,
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
    }

    if (description) {
      updateOrderProps.description = description;
      updateResponse = await authFetch(`${API_ROOT}/order/update-order/${id}`, {
        ...requestOptions,
        body: JSON.stringify(updateOrderProps),
        method: "PUT",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    if (updateResponse?.ok) {
      refreshOrder();
      updateSuccessNotification();
    } else {
      updateFailNotification();
    }
  };

  const updateSuccessNotification = () => {
    api.open({
      message: "Cập nhật đơn hàng",
      description: "Cập nhật đơn hàng thành công",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const updateFailNotification = () => {
    api.open({
      message: "Cập nhật đơn hàng",
      description: "Cập nhật đơn hàng thất bại",
      icon: <FrownOutlined style={{ color: "red" }} />,
    });
  };

  const getStatusMenu = (record: Order) => {
    const statusMenuItems: any[] = [];
    if (roleName === SALES.role) {
      if (record.status === 0) {
        statusMenuItems.push(
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            onClick={() => updateOrder({ id: record.id, status: 1 })}
          >
            Xác nhận
          </Menu.Item>,
          <Menu.Item
            key="-1"
            icon={<UserOutlined />}
            onClick={() => updateOrder({ id: record.id, status: -1 })}
          >
            Huỷ bỏ
          </Menu.Item>
        );
      }
    } else if (roleName === ACCOUTANT.role) {
      if (record.status === 1) {
        statusMenuItems.push(
          <Menu.Item
            key="2"
            icon={<UserOutlined />}
            onClick={() => updateOrder({ id: record.id, status: 2 })}
          >
            Duyệt
          </Menu.Item>,
          <Menu.Item
            key="-1"
            icon={<UserOutlined />}
            onClick={() => updateOrder({ id: record.id, status: -1 })}
          >
            Huỷ bỏ
          </Menu.Item>
        );
      } else if (record.status === 4) {
        statusMenuItems.push(
          <Menu.Item
            key="5"
            icon={<UserOutlined />}
            onClick={() => updateOrder({ id: record.id, status: 5 })}
          >
            Giao thành công
          </Menu.Item>
        );
      }
    }
    return <Menu>{statusMenuItems}</Menu>;
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
          text: "Duyệt",
          color: "blue",
        };
      case 3:
        return {
          text: "Đang chuẩn bị",
          color: "purple",
        };
      case 4:
        return {
          text: "Đang giao",
          color: "rgb(0, 73, 91)",
        };
      case 5:
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

  const columns: ColumnType<Order>[] = useMemo(() => {
    const uniqueConfirmBy = Array.from(
      new Set(orders?.map((order) => order.confirmBy))
    )
      .filter((confirmBy) => confirmBy) // Filter out undefined/null
      .map((confirmBy) => ({
        text: confirmBy,
        value: confirmBy,
      }));
    return [
      {
        title: "id",
        dataIndex: "id",
        key: "id",
        render: (id: string, record: Order) => (
          <div
            className="order-id"
            style={{ color: "blue" }}
            onClick={() => {
              setAddress(
                record.addressCustom ? record.addressCustom : record.address
              );
              setPhoneNumber(
                record.phoneNumberCustom
                  ? record.phoneNumberCustom
                  : record.phoneNumber
              );
              setAgentName(record.agentName ?? "");
              setOrderId(record.id);
              setCurrentOrder(record.orderProductSnapshots);
            }}
          >
            {id}
          </div>
        ),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={searchInput}
              placeholder="Tìm ID đơn hàng"
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
                icon={<SearchOutlined />}
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
          record.id.toLowerCase().includes((value as string).toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
      {
        title: "Đại lý",
        dataIndex: "agentName",
        key: "agentName",
        filters:
          agents?.map((agent) => ({
            text: agent.agentName,
            value: agent.id,
          })) ?? [],
        onFilter: (value, record) => record.agentId === value,
      },
      {
        title: "Tổng thanh toán",
        dataIndex: "totalAmount",
        key: "totalAmount",
        sorter: (a, b) => a.totalAmount - b.totalAmount,
        render: (price: number) => <div>{NumberToVND.format(price)}</div>,
      },
      {
        title: "Ghi chú",
        dataIndex: "description",
        key: "description",
        render: (_, record: Order) => {
          const isEditing = editingRow === record.id;
          return isEditing ? (
            <Space size="middle">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Space>
          ) : (
            <div>{record.description}</div>
          );
        },
      },
      {
        title: "Nhân viên duyệt",
        dataIndex: "confirmBy",
        key: "confirmBy",
        render: (_, record: Order) => {
          return <div>{record.confirmBy}</div>;
        },
        sorter: (a, b) => {
          if (!a.confirmBy) return -1;
          if (!b.confirmBy) return 1;
          return a.confirmBy.localeCompare(b.confirmBy);
        },
        filters: uniqueConfirmBy,
        onFilter: (value, record) => record.confirmBy === value,
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
          const canUpdate =
            (roleName === "SALES" && record.status === 0) ||
            (roleName === "ACCOUNTANT" &&
              (record.status === 1 || record.status === 4)) ||
            (roleName === "STOCKER" && [2, 3, 4].includes(record.status));

          return canUpdate ? (
            <Dropdown overlay={getStatusMenu(record)}>
              <Button>
                <Space style={{ color: status?.color }}>
                  {status?.text}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <div style={{ color: status?.color }}>{status?.text}</div>
          );
        },
        sorter: (a, b) => a.status - b.status,
        filters: [
          { text: "Đã đặt", value: 0 },
          { text: "Xác nhận", value: 1 },
          { text: "Duyệt", value: 2 },
          { text: "Đang chuẩn bị", value: 3 },
          { text: "Đang giao", value: 4 },
          { text: "Giao thành công", value: 5 },
          { text: "Hủy bỏ", value: -1 },
        ],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: "",
        key: "action",
        render: (_, record: Order) => {
          return (
            <Space size="middle">
              {editingRow === record.id ? (
                <>
                  <Popconfirm
                    title="Xác nhận cập nhật?"
                    onConfirm={async () => {
                      await updateOrder({
                        id: record.id,
                        description,
                      });
                      setEditingRow(null);
                      refreshOrder();
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary">Xác nhận</Button>
                  </Popconfirm>
                  <Button onClick={() => setEditingRow(null)}>Huỷ</Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEditingRow(record.id);
                      setDescription(record.description || "");
                    }}
                  >
                    Sửa
                  </Button>
                </>
              )}
            </Space>
          );
        },
      },
    ];
  }, [agents, description, editingRow, refreshOrder, roleName, updateOrder]);

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
      render: (_, record) => {
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
      title: "Ngày đặt",
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
    <div className="ManageOrder">
      {contextHolder}
      <h2 style={{ color: "black" }}>Quản lý đơn</h2>
      <Table columns={columns} dataSource={orders} />
      <Modal
        title="Xem chi tiết đơn"
        open={!!currentOrder}
        onOk={() => {
          setCurrentOrder(null);
          setPhoneNumber("");
          setAgentName("");
          setOrderId("");
          setAddress("");
        }}
        onCancel={() => {
          setCurrentOrder(null);
          setPhoneNumber("");
          setAddress("");
          setAgentName("");
          setOrderId("");
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
            <div>{orderId && <strong>Mã đơn hàng: {orderId}</strong>}</div>
            <div>{agentName && <strong>Tên đại lý: {agentName}</strong>}</div>
            <div>{address && <strong>Địa chỉ: {address}</strong>}</div>
            <div>
              {phoneNumber && <strong>Số điện thoại: {phoneNumber}</strong>}
            </div>
          </div>
        </div>
        <Table columns={orderColumns} dataSource={currentOrder} />
      </Modal>
    </div>
  );
}

export default ManageOrder;
