import { Table } from "antd";
import { useCategories } from "../../hooks/useCategories";
import type { ColumnsType } from "antd/es/table";
import type { Category } from "../../type";

import "./index.css";

export function ManageCategories() {
  const { data, isLoading } = useCategories(1);

  const columns = useCategoryTableColumns();

  return (
    <div className="ManageCategories">
      <Table dataSource={data?.data} columns={columns} loading={isLoading} />
    </div>
  );
}

function useCategoryTableColumns() {
  const columns: ColumnsType<Category> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Updated By",
      render: (_, record) => record.updatedBy || <span className="empty-cell">--</span>,
      key: "updatedBy",
    }
  ];

  return columns;
}
