import {
  Button,
  Input,
  Modal,
  notification,
  Popconfirm,
  Space,
  Spin,
  Table,
} from "antd";
import {
  QuestionCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
  const { data: categories, isLoading, mutate } = useCategories(1);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [isApiCalling, setIsApiCalling] = useState(false);

  const columns = useCategoryTableColumns(
    notificationApi,
    mutate,
    setIsApiCalling
  );

  return (
    <div className="ManageCategories">
      <h2 style={{ color: "black" }}>Quản lý danh mục</h2>
      {contextHolder}
      <AddCategoryButton
        setIsApiCalling={setIsApiCalling}
        notificationApi={notificationApi}
        requestCategoryRefresh={mutate}
      />
      <Spin spinning={isApiCalling}>
        <Table
          dataSource={categories?.data}
          columns={columns}
          loading={isLoading}
        />
      </Spin>
    </div>
  );
}

type ActionHandlerParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

type AddCategoryParams = ActionHandlerParams & {
  name: string;
  description: string;
};

function useAddCategoryHandler(
  notificationApi: NotificationInstance,
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>
) {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();

  const addCategory = useCallback(
    ({ name, description, onSuccess }: AddCategoryParams) => {
      try {
        setIsApiCalling(true);
        authFetch(`${API_ROOT}/category/create-category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name, description }),
        }).then((response) => {
          setIsApiCalling(false);
          if (response.ok) {
            notificationApi.success({
              message: "Thành công",
              description: "Thêm danh mục thành công",
            });
            if (onSuccess) onSuccess();
          } else {
            notificationApi.error({
              message: "Lỗi",
              description: "Thêm danh mục thất bại",
            });
          }
        });
      } catch (error) {
        setIsApiCalling(false);
        notificationApi.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi thêm danh mục",
        });
      }
    },
    [accessToken, authFetch, notificationApi]
  );

  return { addCategory };
}

type AddCategoryButtonProps = {
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>;
  notificationApi: NotificationInstance;
  requestCategoryRefresh: () => void;
};

function AddCategoryButton(props: AddCategoryButtonProps) {
  const { notificationApi, requestCategoryRefresh, setIsApiCalling } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const { addCategory } = useAddCategoryHandler(
    notificationApi,
    setIsApiCalling
  );

  const handleClearForm = () => {
    setCategoryName("");
    setCategoryDescription("");
  };

  const handleAddCategory = () => {
    if (!categoryName) {
      notificationApi.error({
        message: "Lỗi",
        description: "Tên danh mục không được để trống",
      });
      return;
    }

    addCategory({
      name: categoryName,
      description: categoryDescription,
      onSuccess: () => {
        setIsModalVisible(false);
        handleClearForm();
        requestCategoryRefresh();
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        className="AddCategoryButton"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "1rem" }}
      >
        Thêm danh mục
      </Button>
      <Modal
        title="Thêm danh mục"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          handleClearForm();
        }}
        onOk={handleAddCategory}
      >
        <label htmlFor="category-name">Tên danh mục: </label>
        <Input
          required
          type="text"
          placeholder="Thêm tên danh mục"
          name="category-name"
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <label htmlFor="category-description">Mô tả: </label>
        <Input
          required
          type="text"
          placeholder="Thêm mô tả"
          name="category-description"
          onChange={(e) => setCategoryDescription(e.target.value)}
        />
      </Modal>
    </>
  );
}

type EditCategoryParams = ActionHandlerParams & {
  id: string;
  name: string;
  description: string | null;
};

export function useEditCategoryHandler(
  notificationApi: NotificationInstance,
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>
) {
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
        setIsApiCalling(true);
        const response = await authFetch(
          `${API_ROOT}/category/update-category/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name, description }),
          }
        );

        setIsApiCalling(false);
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

type DeleteCategoryParams = ActionHandlerParams & {
  id: string;
};

export function useDeleteCategoryHandler(
  notificationApi: NotificationInstance,
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>
) {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();

  const deleteCategory = useCallback(
    ({ id, onSuccess, onError }: DeleteCategoryParams) => {
      try {
        setIsApiCalling(true);
        authFetch(`${API_ROOT}/category/remove-category/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((response) => {
          setIsApiCalling(false);
          if (response.ok) {
            notificationApi.success({
              message: "Thành công",
              description: "Xoá danh mục thành công",
            });
            if (onSuccess) onSuccess();
          } else {
            notificationApi.error({
              message: "Lỗi",
              description: "Xoá danh mục thất bại",
            });
            if (onError) onError();
          }
        });
      } catch (error) {
        setIsApiCalling(false);
        notificationApi.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi xoá danh mục",
        });
        if (onError) onError();
      }
    },
    [accessToken, authFetch, notificationApi]
  );

  return { deleteCategory };
}

function useCategoryTableColumns(
  notificationApi: NotificationInstance,
  requestCategoryRefresh: () => void,
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const { editCategory } = useEditCategoryHandler(
    notificationApi,
    setIsApiCalling
  );
  const { deleteCategory } = useDeleteCategoryHandler(
    notificationApi,
    setIsApiCalling
  );

  const handleStartEditing = (record: Category) => {
    setEditingKey(record.id);
    setEditedName(record.name);
    setEditedDescription(record.description ?? "");
  };

  const handleEditCategory = async (record: Category) => {
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

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory({
      id: categoryId,
      onSuccess: () => {
        requestCategoryRefresh();
      },
    });
  };

  const handleCancelEditing = () => {
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
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
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
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
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const isEditing = editingKey === record.id;
        return isEditing ? (
          <Space size="middle">
            <Button onClick={() => handleEditCategory(record)} type="primary">
              Lưu
            </Button>
            <Button onClick={handleCancelEditing}>Hủy bỏ</Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button onClick={() => handleStartEditing(record)}>Sửa</Button>
            <Popconfirm
              title="Xoá danh mục"
              description={`Bạn chắc chắn muốn xoá danh mục này? Việc xoá danh mục sẽ đồng thời xoá các sản phẩm liên quan`}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleDeleteCategory(record.id)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return columns;
}
