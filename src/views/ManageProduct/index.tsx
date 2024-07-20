import { useMemo, useState } from "react";
import "./index.css";
import { Table, Space, Button, Modal, notification, Input, Radio } from "antd";
import type { ColumnType } from "antd/es/table";
import { SmileOutlined } from "@ant-design/icons";
import { Category, Product } from "../../type";
import { NumberToVND } from "../../helper";
import {
  useCategories,
  useProducts,
  requestOptions,
} from "../../hooks/useProduct";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";

function ManageProduct() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: categoryResponse } = useCategories(1);
  const { data, mutate: refreshProducts } = useProducts(1);
  const products = useMemo(
    () => data?.data.map((it) => ({ key: it.id, ...it })),
    [data?.data]
  );
  const categories = categoryResponse?.data;

  const openNotification = () => {
    api.open({
      message: "Tạo thất bại",
      description: "Vui lòng điền đủ thông tin",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [activeProduct, setActiveProduct] = useState(false);
  const [nextProductName, setNextProductName] = useState("");
  const [nextProductDescription, setNextProductDescription] = useState("");
  const [nextProductQuantity, setNextProductQuantity] = useState("");
  const [nextPrice, setNextPrice] = useState("");
  const [nextDescription, setNextDescription] = useState("");
  const [nextCategory, setNextCategory] = useState(
    categories && categories[0] ? categories[0].id : ""
  );
  const [nextActiveProduct, setNextActiveProduct] = useState(false);

  const [currentEditing, setCurrentEditing] = useState<Product | null>(null);
  const handleUpdateProduct = async () => {
    const updateData = {
      ...currentEditing,
      categoryId: category,
      price: +price,
      nameProduct: productName,
      description: description,
      activeProduct: activeProduct,
    };
    const updateBody = JSON.stringify(updateData);

    await authFetch(
      `${API_ROOT}/product/update-product/${currentEditing?.id}`,
      {
        ...requestOptions,
        body: updateBody,
        method: "PUT",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Product) => {
    setCurrentEditing(record);
    setProductName(record.nameProduct);
    setPrice(record.price.toString());
    setDescription(record.description);
    setCategory(record.categoryId);
    setActiveProduct(record.activeProduct);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleUpdateProduct();
    refreshProducts();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRecord = async (record: Product) => {
    await authFetch(`${API_ROOT}/product/remove-product/${record.id}`, {
      ...requestOptions,
      method: "DELETE",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshProducts();
  };

  const clearAddInput = () => {
    setNextProductName("");
    setDescription("");
    setNextPrice("");
    setNextProductDescription("");
    setCategory(categories ? categories[0].id : "");
  };

  const handleAddOk = async () => {
    if (
      !nextProductName ||
      !nextProductDescription ||
      !nextPrice ||
      !nextCategory ||
      !nextDescription ||
      !nextProductQuantity
    ) {
      openNotification();
      return;
    }
    const productToAdd = JSON.stringify({
      price: +nextPrice,
      nameProduct: nextProductName,
      description: nextProductDescription,
      quantity: +nextProductQuantity,
      image: null,
      volume: null,
      activeProduct: nextActiveProduct,
    });

    await authFetch(`${API_ROOT}/product/create-product/${nextCategory}`, {
      ...requestOptions,
      body: productToAdd,
      method: "POST",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshProducts();
    clearAddInput();
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleSetNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: any
  ) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      setter(inputValue);
    }
  };

  const columns: ColumnType<Product>[] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
      sorter: (a, b) => a.nameProduct.localeCompare(b.nameProduct),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img style={{ maxWidth: "5rem", maxHeight: "5rem" }} src={image} />
      ),
    },
    {
      title: "Giá niêm yết",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => +a.price - +b.price,
      render: (price: number) => <div>{NumberToVND.format(price)}</div>,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (value: string) => (
        <div>{categories?.find((it) => it.id === value)?.name}</div>
      ),
      sorter: (a, b) => a.categoryId.localeCompare(b.categoryId),
    },
    {
      title: "Hoạt động",
      dataIndex: "activeProduct",
      key: "activeProduct",
      render: (isActive: boolean) => (
        <p style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Hoạt động" : "Tạm dừng"}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Product) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Update</Button>
          <Button onClick={() => handleDeleteRecord(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="ManageProduct">
      {contextHolder}
      <Button
        onClick={() => {
          setIsAddModalOpen(true);
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm
      </Button>
      <Table columns={columns} dataSource={products} />
      <Modal
        title="Sửa sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {currentEditing && (
          <div className="modal-update-container">
            <label htmlFor="product-name">Tên sản phẩm: </label>
            <Input
              value={productName}
              type="text"
              placeholder={currentEditing.nameProduct}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
              name="product-name"
            />
            <label htmlFor="price">Giá niêm yết: </label>
            <Input
              name="price"
              value={price}
              onChange={(e) => {
                handleSetNumberInput(e, setPrice);
              }}
              placeholder={currentEditing.price.toString()}
              maxLength={16}
            />
            <label htmlFor="description">Chi tiết sản phẩm: </label>
            <Input
              name="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder={currentEditing.description}
              maxLength={256}
            />
            <label htmlFor="category">Loại sản phẩm</label>
            <select
              value={category}
              id="category"
              name="category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              {categories?.map((category: Category) => {
                return (
                  <option
                    key={category.id}
                    id={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                );
              })}
            </select>
            <Radio.Group
              onChange={(e) => {
                setActiveProduct(e.target.value);
              }}
              value={activeProduct}
            >
              <Radio value={true}>Hoạt động</Radio>
              <Radio value={false}>Tạm dừng</Radio>
            </Radio.Group>
          </div>
        )}
      </Modal>

      <Modal
        title="Thêm sản phẩm"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <div className="modal-update-container">
          <label htmlFor="product-name">Tên sản phẩm: </label>
          <Input
            value={nextProductName}
            type="text"
            placeholder="Thêm tên sản phẩm"
            onChange={(e) => {
              setNextProductName(e.target.value);
            }}
            name="product-name"
          />
          <label htmlFor="price">Giá niêm yết: </label>
          <Input
            name="price"
            value={nextPrice}
            onChange={(e) => {
              handleSetNumberInput(e, setNextPrice);
            }}
            placeholder={"Thêm giá"}
            maxLength={16}
          />
          <label htmlFor="descrition">Chi tiết sản phẩm: </label>
          <Input
            name="descrition"
            value={nextDescription}
            onChange={(e) => {
              setNextDescription(e.target.value);
            }}
            placeholder={"Thêm chi tiết"}
            maxLength={256}
          />
          <label htmlFor="product-description">Chi tiết: </label>
          <Input
            value={nextProductDescription}
            type="text"
            placeholder="Thêm chi tiết"
            onChange={(e) => {
              setNextProductDescription(e.target.value);
            }}
            name="product-description"
          />
          <label htmlFor="product-quantity">Số lượng: </label>
          <Input
            value={nextProductQuantity}
            type="text"
            placeholder="Thêm số lượng"
            onChange={(e) => {
              setNextProductQuantity(e.target.value);
            }}
            name="product-quantity"
          />
          <label htmlFor="category">Loại sản phẩm</label>
          <select
            value={nextCategory}
            id="category"
            name="category"
            onChange={(e) => {
              setNextCategory(e.target.value);
            }}
          >
            <option value="" disabled selected>
              Chọn loại sơn
            </option>
            {categories?.map((category: Category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
          <Radio.Group
            onChange={(e) => {
              setNextActiveProduct(e.target.value);
            }}
            value={nextActiveProduct}
          >
            <Radio value={true}>Hoạt động</Radio>
            <Radio value={false}>Tạm dừng</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
}

export default ManageProduct;
