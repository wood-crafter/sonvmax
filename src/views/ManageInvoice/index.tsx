import "./index.css";
import { useInvoices } from "../../hooks/useInvoice";
import { Spin, Table } from "antd";
import { Invoice } from "../../type";

function ManageInvoice() {
  const { data, isLoading } = useInvoices(1);

  if (isLoading) return <Spin />;

  const tableData =
    data?.data.map((item: Invoice) => ({
      key: item.invoiceId,
      agentName: item.agentName,
      totalAmount: item.invoice.totalAmount,
      createdAt: item.invoice.createdAt,
    })) || [];

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
  ];

  return (
    <div className="ManageInvoice">
      <h2>Quản lý hóa đơn</h2>
      <Table dataSource={tableData} columns={columns} />
    </div>
  );
}

export default ManageInvoice;
