import { Button, Space, Spin, Table } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";
import { appendIdAsKey } from "../../helper";
import { useCreateRole, useDeleteRole, useRoles } from "../../hooks/useRoles";
import type { Role } from "../../type";
import "./index.css";
import useNotification from "antd/es/notification/useNotification";
import { NotificationInstance } from "antd/es/notification/interface";
import { EditRoleModal } from "./EditRoleModal";

function useRoleTableColumns(
  api: NotificationInstance,
  isLoading: boolean,
  requestRefresh: () => void
) {
  return useMemo(() => {
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
      {
        title: "",
        key: "action",

        render: (_, role: Role) => (
          <Space size="middle">
            <DeleteRoleButton
              id={role.id}
              disabled={isLoading}
              onDeleted={() => {
                api.success({
                  message: "Role deleted",
                  description: `Deleted a role: ${role.name}`,
                  icon: <SmileOutlined style={{ color: "#108ee9" }} />,
                });

                requestRefresh();
              }}
            />
          </Space>
        ),
      },
    ];

    return columns;
  }, [api, isLoading, requestRefresh]);
}

type DeleteRoleButtonProps = {
  id: string;
  disabled: boolean;
  onDeleted(): void;
};

function DeleteRoleButton(props: DeleteRoleButtonProps) {
  const { id, disabled, onDeleted } = props;

  const { trigger, isMutating } = useDeleteRole();

  return (
    <Button
      type="default"
      danger
      disabled={isMutating || disabled}
      onClick={async () => {
        await trigger({ id });

        onDeleted();
      }}
    >
      Delete
    </Button>
  );
}

type AddRoleButtonProps = {
  onAdded(args: { roleName: string }): void;
};

function AddRoleButton(props: AddRoleButtonProps) {
  const { onAdded } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trigger } = useCreateRole();

  const handleAddRole = useCallback(
    async (args: { roleName: string }) => {
      const { roleName } = args;
      await trigger({ roleName });

      setIsModalOpen(false);
      onAdded({ roleName });
    },
    [onAdded]
  );

  return (
    <>
      {isModalOpen && (
        <EditRoleModal
          isOpen={isModalOpen}
          onSubmit={handleAddRole}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Add role
      </Button>
    </>
  );
}

export function ManageRoles() {
  const { data, isLoading, isValidating, mutate } = useRoles(1);
  const [api, contextHolder] = useNotification();

  const roles = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map(appendIdAsKey);
  }, [data?.data]);

  const handleRoleAdded = useCallback(
    ({ roleName }: { roleName: string }) => {
      api.success({
        message: "Role added",
        description: `Added a new role: ${roleName}`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });

      mutate();
    },
    [api]
  );

  const columns = useRoleTableColumns(api, isLoading || isValidating, mutate);

  if (isLoading) return <Spin />;

  return (
    <div className="ManageRoles">
      <h2>Quản lý chức vụ</h2>
      {contextHolder}
      <AddRoleButton onAdded={handleRoleAdded} />
      <Table dataSource={roles} columns={columns} />
    </div>
  );
}
