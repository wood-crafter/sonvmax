/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.css";
import { useInvoices } from "../../hooks/useInvoice";
import { Modal, Spin, Table } from "antd";
import { Invoice } from "../../type";
import { useRef, useState } from "react";
import { NumberToVND } from "../../helper";
import { useUserStore } from "../../store/user";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ManageInvoice() {
  const roleName = useUserStore((state) => state.roleName);
  const { data, isLoading } = useInvoices(1);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Invoice | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <Spin />;

  const tableData = data?.data;

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

  const invoiceColumns = [
    {
      title: "Tên hàng",
      dataIndex: "productName",
      key: "productName",
      render: (_: any, record: any) => {
        return <div>{record.productDetails.productName}</div>;
      },
    },
    {
      title: "Mã màu",
      dataIndex: "color",
      key: "color",
      render: (_: any, record: any) => {
        if (record.colorDetails) return <div>{record.colorDetails.code}</div>;
        else
          return (
            <div>
              rgb(
              {`${record.colorPick.r}, ${record.colorPick.g}, ${record.colorPick.b}`}
              )
            </div>
          );
      },
    },
    {
      title: "DVT",
      dataIndex: "volumeDetails",
      key: "volumeDetails",
      render: (_: any, record: any) => {
        return <div>{record.volumeDetails.volume}</div>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "actualQuantity",
      key: "actualQuantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => {
        return <div>{NumberToVND.format(record.price)}</div>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_: any, record: any) => {
        return <div>{NumberToVND.format(record.totalPrice)}</div>;
      },
    },
  ];

  const columns = [
    {
      title: "Đại lý",
      dataIndex: "agentName",
      key: "agentName",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text: string) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(text)),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: Invoice) => {
        const statusInfo = statusToText(record.order.status);
        return (
          <div style={{ color: `${statusInfo?.color}` }}>
            {statusInfo?.text}
          </div>
        );
      },
    },
  ];

  const exportPDF = async () => {
    if (modalContentRef.current) {
      const modalElement = modalContentRef.current;

      modalElement.style.overflow = "visible";

      const canvas = await html2canvas(modalElement, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save(`phieubanhang${currentRecord?.invoiceId}.pdf`);
    } else {
      console.error("Modal content not found!");
    }
  };

  return (
    <div className="ManageInvoice">
      <h2>
        {roleName === "STOCKER" ? "Quản lý phiếu xuất kho" : "Quản lý hóa đơn"}
      </h2>
      <Table
        dataSource={tableData}
        columns={columns}
        onRow={(record) => ({
          onDoubleClick: () => {
            setCurrentRecord(record);
            setIsOpen(true);
          },
        })}
      />
      <Modal
        title=""
        open={isOpen}
        onOk={() => {
          exportPDF();
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        width={"100%"}
        okText={"Xuất file PDF"}
      >
        <div ref={modalContentRef} style={{ padding: "1rem" }}>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ marginRight: "1rem" }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRPBu76Cz7KqOg25hxVlahntLe2SPjlQvvkQ&s" />
            </div>
            <div style={{ flexGrow: 1, marginRight: "5rem" }}>
              <h2>CÔNG TY CỔ PHẦN SƠN VMAX</h2>
              <h3>
                DC: LK1-D06 khu đô thị Splendora Bắc An Khánh, An Khánh, Hoài
                Đức, Hà Nội
              </h3>
              <h3>DT: 0243.2828.333 - Hotline: 096.555.8485</h3>
              <h1
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {roleName === "STOCKER" ? "PHIẾU XUẤT KHO" : "HÓA ĐƠN BÁN HÀNG"}
              </h1>
              <h2
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {currentRecord?.createdAt}
              </h2>
            </div>
          </div>
          <h5>Khách hàng: {currentRecord?.agentName}</h5>
          <h5>
            Điện thoại:{" "}
            {currentRecord?.order?.phoneNumberCustom ??
              currentRecord?.phoneNumber}
          </h5>
          <h5>
            Địa chỉ:{" "}
            {currentRecord?.order?.addressCustom ?? currentRecord?.address}
          </h5>
          <h5>Đơn vị ship:</h5>
          <Table
            dataSource={currentRecord?.invoice?.order?.warehouseOrders ?? []}
            columns={invoiceColumns}
            pagination={false}
          />
          <h2>
            Tổng tiền hàng:{" "}
            {NumberToVND.format(+(currentRecord?.totalAmount ?? "0"))}
          </h2>
          <h5>Bằng chữ:</h5>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "10rem",
              }}
            >
              <strong>Thủ kho</strong>
              <strong>{currentRecord?.invoice?.createdBy}</strong>
            </div>
            <strong>Người giao hàng</strong>
            <strong>Người nhận hàng</strong>
            <strong>Quản đốc</strong>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ManageInvoice;
