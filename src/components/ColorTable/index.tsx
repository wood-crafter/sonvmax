/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Table } from "antd";
import "./index.css";
import { ColumnType } from "antd/es/table";
import { useColors } from "../../hooks/useColor";

type ColorTableProps = {
  setColor?: React.Dispatch<any>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentColor: React.Dispatch<any>;
};

function ColorTable(props: ColorTableProps) {
  const { isOpen, setIsOpen, setCurrentColor } = props;
  const { data } = useColors();
  const colors = data?.data;

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
      <Table
        columns={columns}
        dataSource={colors}
        onRow={(record) => ({
          onDoubleClick: () => {
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
