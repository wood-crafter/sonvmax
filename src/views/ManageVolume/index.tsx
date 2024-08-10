import "./index.css";
import { Button, notification, Popconfirm, Space } from "antd";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { requestOptions, useVolume } from "../../hooks/useVolume";
import Table, { ColumnType } from "antd/es/table";
import { Volume } from "../../type";
import {
  QuestionCircleOutlined,
  FrownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { API_ROOT } from "../../constant";

function ManageVolume() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data, mutate: refreshVolume } = useVolume(1);
  const volume = data?.data;

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
    },
    {
      title: "",
      key: "action",
      render: (_, record: Volume) => (
        <Space size="middle">
          <Button>Sửa</Button>
          <Popconfirm
            title="Xoá quy cách đóng gói"
            description={`
              "Bạn chắc chắn muốn xoá quy cách đóng gói này?" \n
              Việc xoá quy cách đóng gói sẽ đồng thời xoá đóng gói cho sản phẩm liên quan
              `}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteRecord(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
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
