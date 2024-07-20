import { Spin, Table } from "antd";
import { useRoles } from "../../hooks/useRoles";
import "./index.css";
import { ColumnType } from "antd/es/table";
import { Role } from "../../type";
import { useMemo } from "react";
import { appendIdAsKey } from "../../helper";

const columns: ColumnType<Role>[] = [
  {
    title: "ID",
    dataIndex: "id",
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
];

export function ManageRoles() {
  const { data, isLoading } = useRoles(1);

  const roles = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map(appendIdAsKey);
  }, [data?.data]);

  if (isLoading) return <Spin />;

  return (
    <div className="ManageRoles">
      <Table dataSource={roles} columns={columns} />
    </div>
  );
}
