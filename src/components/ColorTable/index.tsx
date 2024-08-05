/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Table, UploadProps } from "antd";
import "./index.css";
import Upload, { RcFile } from "antd/es/upload";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import readXlsxFile from "read-excel-file";
import { ColumnType } from "antd/es/table";

type ColorTableProps = {
  setColor?: React.Dispatch<any>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentColor: React.Dispatch<any>;
};

const schema = {
  price: {
    prop: "priceColor",
    type: Number,
  },
  type: {
    prop: "colorType",
    type: String,
  },
  name: {
    prop: "colorName",
    type: String,
  },
  R: {
    prop: "r",
    type: Number,
  },
  G: {
    prop: "g",
    type: Number,
  },
  B: {
    prop: "b",
    type: Number,
  },
};

function ColorTable(props: ColorTableProps) {
  const { isOpen, setIsOpen, setCurrentColor } = props;

  const [files, setFiles] = useState<RcFile[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const uploadProps: UploadProps = {
    name: "file",
    accept: "xlsx",
    maxCount: 1,
    beforeUpload(file) {
      setFiles([file]);
      readXlsxFile(file, { schema }).then(async (readInfo) => {
        const { rows } = readInfo;
        setTableData(rows);
      });
    },
    fileList: files,
  };

  const handleAddOk = () => {
    setIsOpen(false);
  };

  const handleAddCancel = () => {
    setIsOpen(false);
  };

  const columns: ColumnType<any>[] = [
    {
      title: "Tên màu",
      dataIndex: "colorName",
      key: "colorName",
    },
    {
      title: "Màu",
      key: "color",
      render: (_, color) => {
        return (
          <div
            style={{
              width: "5rem",
              height: "3rem",
              backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
            }}
          ></div>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "priceColor",
      key: "priceColor",
    },
    {
      title: "r",
      dataIndex: "r",
      key: "r",
    },
    {
      title: "g",
      dataIndex: "g",
      key: "g",
    },
    {
      title: "b",
      dataIndex: "b",
      key: "b",
    },
  ];

  return (
    <Modal
      title="Bảng màu"
      open={isOpen}
      onOk={handleAddOk}
      onCancel={handleAddCancel}
      width={"100%"}
    >
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Thêm file màu</Button>
      </Upload>
      <Table
        columns={columns}
        dataSource={tableData}
        onRow={(record) => ({
          onDoubleClick: () => {
            console.info(record);
            setCurrentColor({
              r: record.r,
              g: record.g,
              b: record.b,
              priceColor: record.priceColor,
              colorType: record.colorType,
              colorName: record.colorName,
            });
            setIsOpen(false);
          },
        })}
      />
    </Modal>
  );
}

export default ColorTable;
