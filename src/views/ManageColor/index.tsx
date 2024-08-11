import "./index.css";
import {
  UploadOutlined,
  AppstoreAddOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, Upload, notification } from "antd";
import { ReactNode, useState } from "react";
import readXlsxFile from "read-excel-file";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { API_ROOT } from "../../constant";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { requestOptions } from "../../hooks/utils";

const schema = {
  priceColor: {
    prop: "priceColor",
    type: Number,
  },
  colorType: {
    prop: "colorType",
    type: String,
  },
  colorName: {
    prop: "colorName",
    type: String,
  },
  r: {
    prop: "r",
    type: Number,
  },
  g: {
    prop: "g",
    type: Number,
  },
  b: {
    prop: "b",
    type: Number,
  },
  code: {
    prop: "code",
    type: String,
  },
};

function ManageColor() {
  // TODO: Add download excel example
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const [files, setFiles] = useState<RcFile[]>([]);
  const openNotification = (
    message: string,
    description: string,
    icon: ReactNode
  ) => {
    api.open({
      message,
      description,
      icon: icon,
    });
  };
  const props: UploadProps = {
    name: "file",
    accept: "xlsx",
    maxCount: 1,
    beforeUpload(file) {
      setFiles([file]);
    },
    fileList: files,
  };

  const handleAddToColors = () => {
    readXlsxFile(files[0], { schema }).then(async (readInfo) => {
      const { rows } = readInfo;

      if (!rows.length) {
        notifyWrongFormatAddColor();
        return;
      }
      const createResponse = await authFetch(`${API_ROOT}/color/import-color`, {
        ...requestOptions,
        body: JSON.stringify({
          colors: rows.map((item) => {
            return {
              ...item,
              parentId: "null",
            };
          }),
        }),
        method: "POST",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (createResponse.status !== 201) {
        openNotification(
          "Thêm vào bảng màu thất bại",
          `
          Mã lỗi: ${createResponse.status}
          ${createResponse.statusText}
          `,
          <FrownOutlined style={{ color: "#e93f10" }} />
        );
      } else {
        openNotification(
          "Thêm vào bảng màu thành công",
          "",
          <SmileOutlined style={{ color: "#108ee9" }} />
        );
      }
      setFiles([]);
    });
  };

  const handleReplaceColors = () => {
    readXlsxFile(files[0], { schema }).then(async (readInfo) => {
      const { rows } = readInfo;

      if (!rows.length) {
        notifyWrongFormatAddColor();
        return;
      }
      const createRes = await authFetch(`${API_ROOT}/color/import-color`, {
        ...requestOptions,
        body: JSON.stringify({
          colors: rows.map((item) => {
            return {
              ...item,
              parentId: "null",
            };
          }),
        }),
        method: "POST",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (createRes.status !== 201) {
        openNotification(
          "Thay đổi bảng màu thất bại",
          `
          Mã lỗi: ${createRes.status}
          ${createRes.statusText}
          `,
          <FrownOutlined style={{ color: "#e93f10" }} />
        );
      } else {
        openNotification(
          "Thay đổi bảng màu thành công",
          "",
          <SmileOutlined style={{ color: "#108ee9" }} />
        );
      }
      setFiles([]);
    });
  };

  const notifyWrongFormatAddColor = () => {
    api.open({
      message: "Thêm màu thất bại",
      description: "File không đúng đinh dạng",
    });
  };

  return (
    <div className="ManageColor">
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Thêm file màu</Button>
      </Upload>

      <Button
        disabled={!files?.length}
        icon={<AppstoreAddOutlined />}
        onClick={handleAddToColors}
      >
        Thêm vào bảng màu
      </Button>
      <Button
        disabled={!files?.length}
        icon={<ImportOutlined />}
        onClick={handleReplaceColors}
      >
        Thay thế bảng màu
      </Button>
    </div>
  );
}

export default ManageColor;
