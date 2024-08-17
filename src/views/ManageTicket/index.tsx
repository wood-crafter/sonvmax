/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Modal,
  Input,
  notification,
} from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useTickets } from "../../hooks/useTicket";
import "./index.css";
import { ColumnType } from "antd/es/table";
import { Ticket, WarehouseOrders } from "../../type";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import { requestOptions } from "../../hooks/utils";
import { useUserStore } from "../../store/user";

function ManageTicket() {
  const accessToken = useUserStore((state) => state.accessToken);
  const { data, mutate: refreshTickets } = useTickets(1);
  const [api, contextHolder] = notification.useNotification();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [orderQuantities, setOrderQuantities] = useState<
    Record<string, number>
  >({});
  const [initialOrderQuantities, setInitialOrderQuantities] = useState<
    Record<string, number>
  >({});
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [currentCancel, setCurrentCancel] = useState("");
  const [descriptionCancel, setDescriptionCancel] = useState("");
  const [isCancelDetails, setIsCancelDetails] = useState(false);
  const authFetch = useAuthenticatedFetch();

  const handleCancelTicket = async () => {
    if (!currentCancel) {
      api.open({
        message: "Tạo phiếu xuất lỗi",
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
    const updateTicketRes = await authFetch(
      `${API_ROOT}/ticket/${currentCancel}`,
      {
        ...requestOptions,
        method: "PUT",
        body: JSON.stringify({
          statusTicket: -1,
          description: descriptionCancel,
        }),
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (updateTicketRes.ok) {
      api.open({
        message: "Hủy phiếu thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshTickets();
      setIsCancelDetails(false);
      setDescriptionCancel("");
      setCurrentCancel("");
    } else {
      api.open({
        message: "Hủy phiếu thất bại",
        icon: <FrownOutlined style={{ color: "#red" }} />,
      });
    }
  };

  const handleRowClick = (record: Ticket) => {
    setSelectedTicket(record);
    const initialQuantities: Record<string, number> = {};
    const orderQuantity: Record<string, number> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    record.ticket?.order?.warehouseOrders.forEach((order: any) => {
      initialQuantities[order.id] = 0;
      orderQuantity[order.id] = 0;
    });

    setOrderQuantities(orderQuantity);
    setInitialOrderQuantities(initialQuantities);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
    setIsButtonActive(false);
  };

  useEffect(() => {
    // Set button active if any input was changed
    const isChanged = Object.keys(orderQuantities).some(
      (key) => orderQuantities[key] !== initialOrderQuantities[key]
    );
    setIsButtonActive(isChanged);
  }, [orderQuantities, initialOrderQuantities]);

  const handleQuantityChange = (id: string, value: number, max: number) => {
    if (value >= 0 && value <= max) {
      setOrderQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleUpdate = async () => {
    const item: any = [];
    Object.keys(orderQuantities).forEach((it) => {
      if (orderQuantities[it] !== 0) {
        const itemToPush: any = {};
        itemToPush.id = it;
        itemToPush.actualQuantity = orderQuantities[it];
        item.push(itemToPush);
      }
    });
    const body = {
      warehouseOrders: {
        update: item,
      },
    };
    const updateTicketRes = await authFetch(
      `${API_ROOT}/ticket/${selectedTicket.ticket.id}`,
      {
        ...requestOptions,
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (updateTicketRes.ok) {
      api.open({
        message: "Tạo phiếu xuất kho",
        description: "Tạo phiếu xuất kho thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshTickets();
      handleModalClose();
    } else {
      api.open({
        message: "Tạo phiếu xuất kho",
        description: "Tạo phiếu xuất kho thất bại",
        icon: <FrownOutlined style={{ color: "#red" }} />,
      });
    }
  };

  const orderColumns: ColumnType<WarehouseOrders>[] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productDetails",
      key: "productDetails",
      render: (_, record: WarehouseOrders) => {
        return <div>{record?.productDetails?.productName}</div>;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "productDetails",
      key: "image",
      render: (_, record: WarehouseOrders) => {
        return (
          <img style={{ width: "3rem" }} src={record?.productDetails?.image} />
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "center" }}>Màu</div>
      ),
      dataIndex: "productDetails",
      key: "color",
      render: (_, record: WarehouseOrders) => {
        if (record.colorDetails) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: `rgb(${record.colorDetails.r}, ${record.colorDetails.g}, ${record.colorDetails.b})`,
                }}
              ></div>
              <div>{`Mã màu: ${record.colorDetails.code}`}</div>
            </div>
          );
        } else if (record.colorPick) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: `rgb(${record.colorPick.r}, ${record.colorPick.g}, ${record.colorPick.b})`,
                }}
              ></div>
              <div>{`rgb(${record.colorPick.r}, ${record.colorPick.g}, ${record.colorPick.b})`}</div>
            </div>
          );
        }
      },
    },
    {
      title: "Quy cách đóng gói",
      dataIndex: "volumeDetails",
      key: "volumeDetails",
      render: (_, record: WarehouseOrders) => {
        return <div>{record?.volumeDetails?.volume}</div>;
      },
    },
    {
      title: "Số lượng cần",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record: WarehouseOrders) => {
        return <div>{record?.quantity}</div>;
      },
    },
    {
      title: "Số lượng đã làm",
      dataIndex: "actualQuantity",
      key: "actualQuantity",
      render: (_, record: WarehouseOrders) => {
        const maxQuantity = record?.quantity;
        return (
          <Input
            type="number"
            min={0}
            max={maxQuantity}
            value={orderQuantities[record.id] || ""}
            onChange={(e) =>
              handleQuantityChange(
                record.id,
                Number(e.target.value),
                maxQuantity
              )
            }
          />
        );
      },
    },
  ];

  const columns: ColumnType<Ticket>[] = [
    {
      title: "Mã đơn",
      dataIndex: "ticket",
      key: "orderId",
      render: (_, record: Ticket) => {
        return <div>{record?.ticket?.orderId}</div>;
      },
    },
    {
      title: "Địa chỉ giao",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "ticket",
      key: "dueDate",
      render: (_, record: Ticket) => {
        return <div>{record?.ticket?.dueDate}</div>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "ticket",
      key: "status",
      render: (_, record: Ticket) => {
        const status = record?.ticket?.statusTicket;
        let statusText;
        let dropdownMenu;

        switch (status) {
          case 0:
            statusText = <span style={{ color: "orange" }}>Chưa chuẩn bị</span>;
            dropdownMenu = (
              <Menu
                onClick={() => {
                  setCurrentCancel(record?.ticket?.id);
                  setIsCancelDetails(true);
                  setDescriptionCancel("");
                }}
              >
                <Menu.Item key="cancel" style={{ color: "red" }}>
                  Hủy bỏ
                </Menu.Item>
              </Menu>
            );
            return (
              <Dropdown overlay={dropdownMenu} trigger={["hover"]}>
                <Button>{statusText}</Button>
              </Dropdown>
            );
          case 1:
            statusText = <span style={{ color: "blue" }}>Đang chuẩn bị</span>;
            break;
          case 2:
            statusText = <span style={{ color: "green" }}>Chuẩn bị xong</span>;
            break;
          case -1:
            statusText = <span style={{ color: "red" }}>Hủy bỏ</span>;
            break;
          default:
            statusText = <span>Mã lỗi</span>;
        }

        return <div>{statusText}</div>;
      },
    },
  ];

  return (
    <div className="ManageTicket">
      <h3>Quản lý xuất kho</h3>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={data?.data}
        onRow={(record) => ({
          onDoubleClick: () => handleRowClick(record),
        })}
      />
      {selectedTicket && (
        <Modal
          title="Chi tiết phiếu xuất kho"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button
              key="submit"
              type="primary"
              disabled={!isButtonActive}
              onClick={handleUpdate}
            >
              Cập nhật
            </Button>,
          ]}
          width={"100%"}
        >
          <Table
            columns={orderColumns}
            dataSource={selectedTicket.ticket?.order?.warehouseOrders.filter(
              (it: any) => it.quantity !== 0
            )}
          />
        </Modal>
      )}
      <Modal
        title="Chi tiết hủy đơn"
        open={isCancelDetails}
        onCancel={() => setIsCancelDetails(false)}
        onOk={() => {
          handleCancelTicket();
          setIsCancelDetails(false);
        }}
        width={"80%"}
      >
        <Input
          value={descriptionCancel}
          onChange={(e) => {
            setDescriptionCancel(e.target.value);
          }}
        />
      </Modal>
    </div>
  );
}

export default ManageTicket;
