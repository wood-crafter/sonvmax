import { useState } from "react";
import "./index.css";
import { Button, Input, notification, Popconfirm, Space } from "antd";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { requestOptions, useVolume } from "../../hooks/useVolume";
import Table, { ColumnType } from "antd/es/table";
import { Volume } from "../../type";
import {
  QuestionCircleOutlined,
  FrownOutlined,
  SmileOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { API_ROOT } from "../../constant";

function ManageVolume() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, mutate: refreshVolume } = useVolume(1);
  const volume = data?.data;

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedVolume, setEditedVolume] = useState<string>("");

  const deleteSuccessNotification = () => {
    api.open({
      message: "Xoá thành công",
      description: "Xoá quy cách đóng gói thành công",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const deleteFailNotification = () => {
    api.open({
      message: "Xoá thất bại",
      description: "Xoá quy cách đóng gói thất bại",
      icon: <FrownOutlined style={{ color: "red" }} />,
    });
  };

  const handleDeleteRecord = async (id: string) => {
    const deleteRes = await authFetch(`${API_ROOT}/volume/${id}`, {
      ...requestOptions,
      method: "DELETE",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (deleteRes.ok) {
      deleteSuccessNotification();
      refreshVolume();
    } else {
      deleteFailNotification();
    }
  };

  const handleEdit = (record: Volume) => {
    setEditingKey(record.id);
    setEditedVolume(record.volume);
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditedVolume("");
  };

  const handleSaveEdit = async (record: Volume) => {
    if (!editedVolume) {
      api.error({
        message: "Lỗi",
        description: "Quy cách đóng gói không được để trống",
      });
      return;
    }

    const updateRes = await authFetch(`${API_ROOT}/volume/${record.id}`, {
      ...requestOptions,
      method: "PUT",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ volume: editedVolume }),
    });

    if (updateRes.ok) {
      api.success({
        message: "Thành công",
        description: "Cập nhật quy cách đóng gói thành công",
      });
      refreshVolume();
      setEditingKey(null);
    } else {
      api.error({
        message: "Lỗi",
        description: "Cập nhật quy cách đóng gói thất bại",
      });
    }
  };

  const columns: ColumnType<Volume>[] = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Quy cách đóng gói",
      dataIndex: "volume",
      key: "volume",
      render: (_, record: Volume) =>
        editingKey === record.id ? (
          <Input
            value={editedVolume}
            onChange={(e) => setEditedVolume(e.target.value)}
          />
        ) : (
          record.volume
        ),
    },
    {
      title: "",
      key: "action",
      render: (_, record: Volume) => {
        const isEditing = editingKey === record.id;
        return isEditing ? (
          <Space size="middle">
            <Button onClick={() => handleSaveEdit(record)} type="primary">
              Ok
            </Button>
            <Button
              onClick={handleCancelEdit}
              style={{ backgroundColor: "yellow" }}
            >
              Huỷ
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button onClick={() => handleEdit(record)} type="primary">
              Sửa
            </Button>
            <Popconfirm
              title="Xoá quy cách đóng gói"
              description={`Bạn chắc chắn muốn xoá quy cách đóng gói này? Việc xoá quy cách đóng gói sẽ đồng thời xoá đóng gói cho sản phẩm liên quan`}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleDeleteRecord(record.id)}
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

  return (
    <div className="ManageVolume">
      {contextHolder}
      <Table columns={columns} dataSource={volume} />
    </div>
  );
}

export default ManageVolume;
