/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Table, Input, Space, Button } from "antd";
import { ColumnType } from "antd/es/table";
import { useColors } from "../../hooks/useColor";
import "./index.css";
import { RGB } from "../../type";
import { ColorResult, SketchPicker } from "react-color";
import { CloseOutlined } from "@ant-design/icons";

type Color = {
  id: string;
  colorName: string;
  code: string;
  r: number;
  g: number;
  b: number;
  priceColor: string;
};

type ColorTableProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentColor?: React.Dispatch<any>;
  onPicked?: (currentColorId: string, rgb: RGB) => Promise<void>;
  currentColor?: RGB;
  setColorId?: React.Dispatch<React.SetStateAction<string | null>>;
  currentColorId?: string | null;
};

const ColorTable: React.FC<ColorTableProps> = (props) => {
  const {
    isOpen,
    setIsOpen,
    setCurrentColor,
    onPicked,
    currentColor,
    setColorId,
    currentColorId,
  } = props;
  const { data } = useColors();
  const colors = data?.data;

  const handleAddOk = () => {
    setIsOpen(false);
  };

  const handleAddCancel = () => {
    setIsOpen(false);
  };

  const handleChangeColorComplete = (color: ColorResult) => {
    if (onPicked) {
      onPicked("", color.rgb);
      setIsOpen(false);
    }
  };

  const getColumnSearchProps = (dataIndex: keyof Color): ColumnType<Color> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ""}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <a href="#!" onClick={() => confirm()}>
            Search
          </a>
          <a href="#!" onClick={() => clearFilters && clearFilters()}>
            Reset
          </a>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <span
        style={{
          color: filtered ? "#1890ff" : undefined,
          fontSize: "16px",
        }}
      >
        🔍
      </span>
    ),
    onFilter: (value: any, record: Color) => {
      const filterValue = value as string; // Type cast here
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  });

  const handleClickNoColor = () => {
    if (setCurrentColor) {
      setCurrentColor({ r: 255, g: 255, b: 255 });
      setIsOpen(false);
    } else if (onPicked) {
      onPicked("", { r: 255, g: 255, b: 255 });
      setIsOpen(false);
    }
  };

  const columns: ColumnType<Color>[] = [
    {
      title: "Mã màu",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Tên màu",
      dataIndex: "colorName",
      key: "colorName",
      ...getColumnSearchProps("colorName"),
    },
    {
      title: "Màu",
      key: "color",
      render: (_, color) => (
        <div
          style={{
            width: "5rem",
            height: "3rem",
            backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
          }}
        ></div>
      ),
    },
    {
      title: "Giá (% tính trên giá sơn trắng)",
      dataIndex: "priceColor",
      key: "priceColor",
      sorter: (a, b) => +a.priceColor - +b.priceColor,
    },
    // {
    //   title: "r",
    //   dataIndex: "r",
    //   key: "r",
    // },
    // {
    //   title: "g",
    //   dataIndex: "g",
    //   key: "g",
    // },
    // {
    //   title: "b",
    //   dataIndex: "b",
    //   key: "b",
    // },
  ];

  return (
    <Modal
      title="Bảng màu"
      open={isOpen}
      onOk={handleAddOk}
      onCancel={handleAddCancel}
      width={"100%"}
    >
      <div
        style={{ color: "red", display: "flex", justifyContent: "flex-end" }}
      >
        *Màu sắc sơn hiển thị chỉ mang tính chất tham khảo và có thể khác biệt
        so với màu sơn thực tế do sai lệch về phần cứng hiển thị.
      </div>
      <div
        style={{ color: "red", display: "flex", justifyContent: "flex-end" }}
      >
        *Xin quý khách vui long tham khảo và đối chiếu với ô màu thực tế trên
        bảng màu hoặc quạt màu chính hãng được cung cấp
      </div>
      <div
        style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}
      >
        <h3>Không chọn màu:</h3>
        <Button
          icon={<CloseOutlined style={{ color: "red" }} />}
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            color: "red",
            marginLeft: "0.5rem",
          }}
          onClick={handleClickNoColor}
        />
      </div>
      {(currentColor || currentColorId) && (
        <SketchPicker
          disableAlpha
          color={currentColor}
          onChangeComplete={handleChangeColorComplete}
        />
      )}
      <Table
        columns={columns}
        dataSource={colors}
        onRow={(record) => ({
          onDoubleClick: () => {
            if (setColorId) {
              setColorId(record.id);
            }
            if (setCurrentColor) {
              setCurrentColor({
                r: record.r,
                g: record.g,
                b: record.b,
                priceColor: record.priceColor,
                colorName: record.colorName,
                code: record.code,
              });
            }
            if (onPicked) {
              onPicked(record.id, { r: record.r, g: record.g, b: record.b });
            }
            setIsOpen(false);
          },
        })}
      />
    </Modal>
  );
};

export default ColorTable;
