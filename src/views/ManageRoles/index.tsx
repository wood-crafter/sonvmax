import { Button, Form, Input, Modal, Space, Spin, Table } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";
import { appendIdAsKey } from "../../helper";
import { useCreateRole, useDeleteRole, useRoles } from "../../hooks/useRoles";
import type { Role } from "../../type";
import "./index.css";
import useNotification from "antd/es/notification/useNotification";
import FormItem from "antd/es/form/FormItem";
import { NotificationInstance } from "antd/es/notification/interface";

function useRoleTableColumns(
  api: NotificationInstance,
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
        title: "Action",
        key: "action",

        render: (_, role: Role) => (
          <Space size="middle">
            <Button onClick={() => {}}>Update</Button>
            <DeleteRoleButton
              id={role.id}
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
  }, [api, requestRefresh]);
}

type DeleteRoleButtonProps = {
  id: string;
  onDeleted(): void;
};

function DeleteRoleButton(props: DeleteRoleButtonProps) {
  const { id, onDeleted } = props;

  const { trigger, isMutating } = useDeleteRole();

  return (
    <Button
      type="default"
      danger
      disabled={isMutating}
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
  const [roleName, setRoleName] = useState("");
  const { trigger } = useCreateRole();

  const handleAddRole = useCallback(async () => {
    await trigger({ roleName });

    setIsModalOpen(false);
    onAdded({ roleName });
  }, [onAdded, roleName]);

  return (
    <>
      {isModalOpen && (
        <Modal
          title="Add role"
          open={isModalOpen}
          onOk={handleAddRole}
          onCancel={() => {
            setIsModalOpen(false);
            setRoleName("");
          }}
        >
          <Form>
            <FormItem>
              <Input
                placeholder="Role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </FormItem>
          </Form>
        </Modal>
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
  const { data, isLoading, mutate } = useRoles(1);
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

  const columns = useRoleTableColumns(api, mutate);

  if (isLoading) return <Spin />;

  return (
    <div className="ManageRoles">
      {contextHolder}
      <AddRoleButton onAdded={handleRoleAdded} />
      <Table dataSource={roles} columns={columns} />
    </div>
  );
}
