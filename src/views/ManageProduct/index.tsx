import { useEffect, useMemo, useState } from "react";
import "./index.css";
import {
  Table,
  Space,
  Button,
  Modal,
  notification,
  Input,
  Radio,
  Popconfirm,
  Spin,
} from "antd";
import type { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  FrownOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Category, PagedResponse, Product } from "../../type";
import { NumberToVND } from "../../helper";
import {
  useCategories,
  useProducts,
  requestOptions,
} from "../../hooks/useProduct";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import { KeyedMutator } from "swr";
import TextArea from "antd/es/input/TextArea";

type AddProductButtonProps = {
  categories: Category[] | undefined;
  handleSetNumberInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  refreshProducts: KeyedMutator<PagedResponse<Product>>;
  accessToken: string;
  authFetch: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>;
  missingAddPropNoti: () => void;
  addSuccessNoti: () => void;
  addFailNoti: (status: number, statusText: string) => void;
};

type UpdateProductModalProps = {
  categories: Category[] | undefined;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentEditing: Product;
  authFetch: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>;
  accessToken: string;
  refreshProducts: KeyedMutator<PagedResponse<Product>>;
  handleSetNumberInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => void;
};

function AddProductButton(props: AddProductButtonProps) {
  const {
    categories,
    handleSetNumberInput,
    refreshProducts,
    accessToken,
    authFetch,
    missingAddPropNoti,
    addSuccessNoti,
    addFailNoti,
  } = props;
  const [nextProductName, setNextProductName] = useState("");
  const [nextImage, setNextImage] = useState<string>("");
  const [nextProductDescription, setNextProductDescription] = useState("");
  const [nextProductQuantity, setNextProductQuantity] = useState("");
  const [nextPrice, setNextPrice] = useState("");
  const [nextDescription, setNextDescription] = useState("");
  const [nextCategory, setNextCategory] = useState(
    categories && categories[0] ? categories[0].id : ""
  );
  const [nextActiveProduct, setNextActiveProduct] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clearAddInput = () => {
    setNextProductName("");
    setNextImage("");
    setNextDescription("");
    setNextPrice("");
    setNextProductDescription("");
    setNextCategory(categories ? categories[0].id : "");
  };

  const handleAddOk = async () => {
    if (
      !nextProductName ||
      !nextProductDescription ||
      !nextPrice ||
      !nextCategory ||
      !nextDescription ||
      !nextProductQuantity ||
      !nextImage
    ) {
      missingAddPropNoti();
      return;
    }
    const productToAdd = JSON.stringify({
      price: +nextPrice,
      nameProduct: nextProductName,
      description: nextProductDescription,
      quantity: +nextProductQuantity,
      image: nextImage,
      volume: null,
      activeProduct: nextActiveProduct,
    });

    const createResponse = await authFetch(
      `${API_ROOT}/product/create-product/${nextCategory}`,
      {
        ...requestOptions,
        body: productToAdd,
        method: "POST",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (createResponse.status !== 201) {
      addFailNoti(createResponse.status, createResponse.statusText);
    } else {
      addSuccessNoti();
    }
    refreshProducts();
    clearAddInput();
  };
  const handleAddCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm
      </Button>
      <Modal
        title="Thêm sản phẩm"
        open={isModalOpen}
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
          <label htmlFor="product-name">Ảnh sản phẩm: </label>
          <Input
            value={nextImage}
            type="text"
            placeholder="Thêm ảnh sản phẩm"
            onChange={(e) => {
              setNextImage(e.target.value);
            }}
            name="product-name"
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
          <TextArea
            value={nextProductDescription}
            placeholder="Thêm chi tiết"
            onChange={(e) => {
              setNextProductDescription(e.target.value);
            }}
            autoSize={{ minRows: 5, maxRows: 30 }}
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
    </>
  );
}

function UpdateProductModal(props: UpdateProductModalProps) {
  const {
    isModalOpen,
    setIsModalOpen,
    currentEditing,
    authFetch,
    accessToken,
    refreshProducts,
    handleSetNumberInput,
    categories,
  } = props;

  const [productName, setProductName] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [activeProduct, setActiveProduct] = useState(false);

  useEffect(() => {
    setProductName(currentEditing.nameProduct);
    setPrice(currentEditing.price.toString());
    setDescription(currentEditing.description);
    setCategory(currentEditing.categoryId);
    setActiveProduct(currentEditing.activeProduct);
    setImage(currentEditing.image);
  }, [currentEditing]);

  const handleUpdateProduct = async () => {
    const updateData = {
      categoryId: category,
      price: +price,
      nameProduct: productName,
      description: description,
      activeProduct: activeProduct,
      image: image,
      id: currentEditing?.id,
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

  const handleOk = async () => {
    await handleUpdateProduct();
    refreshProducts();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
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
          <label htmlFor="product-name">Ảnh sản phẩm: </label>
          <Input
            value={image}
            type="text"
            placeholder={currentEditing.image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
            name="product-name"
          />
          <label htmlFor="description">Chi tiết sản phẩm: </label>
          <TextArea
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder={currentEditing.description}
            autoSize={{ minRows: 5, maxRows: 30 }}
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
                <option key={category.id} id={category.id} value={category.id}>
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
  );
}

function ManageProduct() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: categoryResponse } = useCategories(1);
  const { data, isLoading, mutate: refreshProducts } = useProducts(1);
  const products = useMemo(
    () => data?.data.map((it) => ({ key: it.id, ...it })),
    [data?.data]
  );
  const categories = categoryResponse?.data;

  const missingAddPropsNotification = () => {
    api.open({
      message: "Tạo thất bại",
      description: "Vui lòng điền đủ thông tin",
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const addSuccessNotification = () => {
    api.open({
      message: "Tạo thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const addFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Tạo thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const [currentEditing, setCurrentEditing] = useState<Product>({
    id: "",
    nameProduct: "",
    price: 0,
    description: "",
    categoryId: "",
    activeProduct: false,
    image: "",
    quantity: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (record: Product) => {
    setCurrentEditing(record);
    setIsModalOpen(true);
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

  const handleSetNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
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
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn chắc chắn muốn xoá sản phẩm này?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteRecord(record)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin />;

  return (
    <div className="ManageProduct">
      {contextHolder}
      <AddProductButton
        addSuccessNoti={addSuccessNotification}
        addFailNoti={addFailNotification}
        missingAddPropNoti={missingAddPropsNotification}
        categories={categories}
        handleSetNumberInput={handleSetNumberInput}
        refreshProducts={refreshProducts}
        accessToken={accessToken}
        authFetch={authFetch}
      />
      <Table columns={columns} dataSource={products} />
      <UpdateProductModal
        categories={categories}
        handleSetNumberInput={handleSetNumberInput}
        refreshProducts={refreshProducts}
        accessToken={accessToken}
        authFetch={authFetch}
        currentEditing={currentEditing}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}

export default ManageProduct;
