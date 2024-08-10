import { Button, Input, notification, Space, Table } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useState } from "react";
import { API_ROOT } from "../../constant";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useCategories } from "../../hooks/useCategories";
import { useUserStore } from "../../store/user";
import type { Category } from "../../type";

import "./index.css";

export function ManageCategories() {
  const { data, isLoading, mutate } = useCategories(1);
  const [api, contextHolder] = notification.useNotification();

  const columns = useCategoryTableColumns(api, mutate);

  return (
    <div className="ManageCategories">
      {contextHolder}
      <Table dataSource={data?.data} columns={columns} loading={isLoading} />
    </div>
  );
}

type EditCategoryParams = {
  id: string;
  name: string;
  description: string | null;
  onSuccess?: () => void;
  onError?: () => void;
};

export function useEditCategoryHandler(notificationApi: NotificationInstance) {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();

  const editCategory = useCallback(
    async ({
      id,
      name,
      description,
      onSuccess,
      onError,
    }: EditCategoryParams) => {
      try {
        const response = await authFetch(
          `${API_ROOT}/category/update-categorys/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name, description }),
          }
        );

        if (response.ok) {
          notificationApi.success({
            message: "Thành công",
            description: "Cập nhật danh mục thành công",
          });
          if (onSuccess) onSuccess();
        } else {
          notificationApi.error({
            message: "Lỗi",
            description: "Cập nhật danh mục thất bại",
          });
          if (onError) onError();
        }
      } catch (error) {
        notificationApi.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi cập nhật danh mục",
        });
        if (onError) onError();
      }
    },
    [accessToken, authFetch, notificationApi]
  );

  return { editCategory };
}

function useCategoryTableColumns(
  notificationApi: NotificationInstance,
  requestCategoryRefresh: () => void
) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const { editCategory } = useEditCategoryHandler(notificationApi);

  const handleEdit = (record: Category) => {
    setEditingKey(record.id);
    setEditedName(record.name);
    setEditedDescription(record.description ?? "");
  };

  const handleSave = async (record: Category) => {
    try {
      await editCategory({
        id: record.id,
        name: editedName,
        description: editedDescription,
        onSuccess: () => {
          setEditingKey(null);
          setEditedName("");
          setEditedDescription("");

          requestCategoryRefresh();
        },
      });
    } finally {
      setEditingKey(null);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditedName("");
    setEditedDescription("");
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        editingKey === record.id ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          record.name
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, record) =>
        editingKey === record.id ? (
          <Input
            value={editedDescription || ""}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          record.description
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isEditing = editingKey === record.id;
        return isEditing ? (
          <Space size="middle">
            <Button onClick={() => handleSave(record)} type="primary">
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        ) : (
          <Button onClick={() => handleEdit(record)}>Edit</Button>
        );
      },
    },
  ];

  return columns;
}
