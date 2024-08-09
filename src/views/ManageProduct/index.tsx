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
  Select,
} from "antd";
import type { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  FrownOutlined,
  QuestionCircleOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Category,
  PagedResponse,
  Product,
  ProductVolume,
  Volume,
} from "../../type";
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
import { useVolume } from "../../hooks/useVolume";

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
  volumes: Volume[] | undefined;
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
  updateSuccessNoti: () => void;
  updateFailNoti: (status: number, statusText: string) => void;
  allVolumes: Volume[] | undefined;
};

type ProductTableProps = {
  products: Product[] | undefined;
  categories: Category[] | undefined;
  volumes: Volume[] | undefined;
  showModal: (record: Product) => void;
  handleDeleteRecord: (record: Product) => Promise<void>;
};

const getDefaultSelectedVolumePrices = (products: Product[] | undefined) => {
  const defaultSelectedVolumePrices: {
    [key: string]: number;
  } = {};

  products?.forEach((product) => {
    defaultSelectedVolumePrices[product.id] = product.volumes[0].price;
  });

  return defaultSelectedVolumePrices;
};

function AddProductButton(props: AddProductButtonProps) {
  const {
    categories,
    refreshProducts,
    accessToken,
    authFetch,
    missingAddPropNoti,
    addSuccessNoti,
    addFailNoti,
    volumes,
  } = props;
  const [nextProductName, setNextProductName] = useState("");
  const [nextImage, setNextImage] = useState<string>("");
  const [nextProductDescription, setNextProductDescription] = useState("");
  const [nextVolumes, setNextVolumes] = useState<ProductVolume[]>([
    { id: "", price: 0 },
  ]);
  const [nextCategory, setNextCategory] = useState(
    categories && categories[0] ? categories[0].id : ""
  );
  const [nextActiveProduct, setNextActiveProduct] = useState(false);
  const [nextCanColorPick, setNextCanColorPick] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clearAddInput = () => {
    setNextProductName("");
    setNextImage("");
    setNextVolumes([{ id: "", price: 0 }]);
    setNextProductDescription("");
    setNextCategory(categories ? categories[0].id : "");
  };

  const isNextVolumesFullfilled = () => {
    let isFullfilled = true;
    nextVolumes.forEach((volume) => {
      if (+volume.price === 0 || !volume.id) {
        isFullfilled = false;
      }
    });

    return isFullfilled;
  };

  const handleAddOk = async () => {
    if (
      !nextProductName ||
      !nextProductDescription ||
      !isNextVolumesFullfilled() ||
      !nextCategory ||
      !nextImage
    ) {
      missingAddPropNoti();
      return;
    }
    const productToAdd = JSON.stringify({
      volumes: nextVolumes,
      nameProduct: nextProductName,
      description: nextProductDescription,
      image: nextImage,
      volume: nextVolumes,
      activeProduct: nextActiveProduct,
      canColorPick: nextCanColorPick,
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
          {nextVolumes.length !== 0 &&
            nextVolumes.map((it, index) => (
              <>
                <label htmlFor="price">Khối lượng {index + 1}: </label>
                <div style={{ width: "100%", display: "flex" }}>
                  <Select
                    onChange={(value) => {
                      setNextVolumes((preVolumes) => {
                        const updatedVolumes = [...preVolumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          id: value,
                        };
                        return updatedVolumes;
                      });
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    {volumes?.map((volumn) => (
                      <Select.Option
                        key={volumn.id}
                        value={volumn.id}
                        selected={volumn.id === it.id}
                      >
                        {volumn.volume}
                      </Select.Option>
                    ))}
                  </Select>

                  {nextVolumes.length !== 1 && (
                    <Button
                      onClick={() => {
                        setNextVolumes((preVolumes) => {
                          const updatedVolumes = [...preVolumes];
                          return updatedVolumes
                            .slice(0, index)
                            .concat(updatedVolumes.slice(index + 1));
                        });
                      }}
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ marginLeft: "1rem" }}
                    />
                  )}
                </div>

                <label htmlFor="price">Giá {index + 1}: </label>
                <Input
                  value={it.price}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      setNextVolumes((preVolumes) => {
                        const updatedVolumes = [...preVolumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          price: newValue === "" ? 0 : +newValue, // Convert to number if not empty
                        };
                        return updatedVolumes;
                      });
                    }
                  }}
                />
                {index === nextVolumes.length - 1 && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setNextVolumes((preVolumes) => {
                          const updatedVolumes = [
                            ...preVolumes,
                            { id: "", price: 0 },
                          ];
                          return updatedVolumes;
                        });
                      }}
                      type="primary"
                      icon={<PlusSquareOutlined />}
                    />
                  </div>
                )}
              </>
            ))}
          <label htmlFor="product-name">Link ảnh sản phẩm: </label>
          <Input
            value={nextImage}
            type="text"
            placeholder="Thêm ảnh sản phẩm"
            onChange={(e) => {
              setNextImage(e.target.value);
            }}
            name="product-name"
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

          <Radio.Group
            onChange={(e) => {
              setNextCanColorPick(e.target.value);
            }}
            value={nextCanColorPick}
          >
            <Radio value={true}>Đa màu</Radio>
            <Radio value={false}>Đơn màu</Radio>
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
    categories,
    allVolumes,
    updateSuccessNoti,
    updateFailNoti,
  } = props;

  const [productName, setProductName] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [volumes, setVolumes] = useState<ProductVolume[]>([
    { id: "", price: 0 },
  ]);
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [activeProduct, setActiveProduct] = useState(false);
  const [canColorPick, setCanColorPick] = useState(false);

  useEffect(() => {
    setProductName(currentEditing.nameProduct);
    setVolumes(
      currentEditing.volumes
        ? currentEditing.volumes.map((it) => {
            return { id: it.id, price: it.price };
          })
        : [{ id: "", price: 0 }]
    );
    setDescription(currentEditing.description);
    setCategory(currentEditing.categoryId);
    setActiveProduct(currentEditing.activeProduct);
    setImage(currentEditing.image);
    setCanColorPick(currentEditing.canColorPick);
  }, [currentEditing]);

  const handleUpdateProduct = async () => {
    const updateData = {
      categoryId: category,
      volumes: volumes,
      nameProduct: productName,
      description: description,
      activeProduct: activeProduct,
      image: image,
      id: currentEditing?.id,
      canColorPick: canColorPick,
    };
    const updateBody = JSON.stringify(updateData);

    const updateResponse = await authFetch(
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

    if (updateResponse.ok) {
      updateSuccessNoti();
    } else {
      updateFailNoti(updateResponse.status, updateResponse.statusText);
    }
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
          {volumes.length !== 0 &&
            volumes.map((volume, index) => (
              <div key={index}>
                <label htmlFor="volume">Khối lượng {index + 1}: </label>
                <div style={{ width: "100%", display: "flex" }}>
                  <Select
                    defaultValue={volume.id}
                    onChange={(value) => {
                      setVolumes((preVolumes) => {
                        const updatedVolumes = [...preVolumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          id: value,
                        };
                        return updatedVolumes;
                      });
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    {allVolumes?.map((volumn) => (
                      <Select.Option key={volumn.id} value={volumn.id}>
                        {volumn.volume}
                      </Select.Option>
                    ))}
                  </Select>
                  {volumes.length > 1 && (
                    <Button
                      onClick={() => {
                        setVolumes((prevVolumes) => {
                          const updatedVolumes = [
                            ...prevVolumes.slice(0, index),
                            ...prevVolumes.slice(index + 1),
                          ];
                          return updatedVolumes;
                        });
                      }}
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ marginLeft: "1rem" }}
                    />
                  )}
                </div>
                <label htmlFor="price">Giá {index + 1}: </label>
                <Input
                  value={volume.price}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      setVolumes((prevVolumes) => {
                        const updatedVolumes = [...prevVolumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          price: newValue === "" ? 0 : +newValue, // Convert to number if not empty
                        };
                        return updatedVolumes;
                      });
                    }
                  }}
                />
              </div>
            ))}
          {volumes.length > 0 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  setVolumes((prevVolumes) => [
                    ...prevVolumes,
                    { id: "", price: 0 },
                  ]);
                }}
                type="primary"
                icon={<PlusSquareOutlined />}
                style={{ marginTop: "1rem" }}
              />
            </div>
          )}
          <label htmlFor="product-description">Chi tiết sản phẩm: </label>
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
            {categories?.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
          <Radio.Group
            onChange={(e) => {
              setCanColorPick(e.target.value);
            }}
            value={canColorPick}
          >
            <Radio value={true}>Đa màu</Radio>
            <Radio value={false}>Đơn màu</Radio>
          </Radio.Group>
        </div>
      )}
    </Modal>
  );
}

function ProductTable(props: ProductTableProps) {
  const { products, categories, volumes, showModal, handleDeleteRecord } =
    props;
  const [selectedVolumePrices, setSelectedVolumePrices] = useState<{
    [key: string]: number;
  }>(getDefaultSelectedVolumePrices(products));

  const handleVolumeChange = (productId: string, price: number) => {
    setSelectedVolumePrices((prev) => ({
      ...prev,
      [productId]: price,
    }));
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
      title: "Giá theo khối lượng",
      dataIndex: "volumes",
      key: "volumes",
      render: (_, record: Product) => {
        return (
          <div style={{ display: "flex" }}>
            <Select
              style={{ minWidth: "8rem" }}
              defaultValue={record.volumes[0]?.id}
              onChange={(value) =>
                handleVolumeChange(
                  record.id,
                  record.volumes.find((it) => it.id === value)?.price ?? 0
                )
              }
            >
              {record.volumes?.map((it) => (
                <Select.Option key={it.id} value={it.id}>
                  {volumes?.find((volume) => volume.id === it.id)?.volume}
                </Select.Option>
              ))}
            </Select>
            {selectedVolumePrices[record.id] > 0 && (
              <div
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {NumberToVND.format(selectedVolumePrices[record.id])}
              </div>
            )}
          </div>
        );
      },
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
      sorter: (a, b) => {
        if (!a.activeProduct && b.activeProduct) return -1;
        return 1;
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record: Product) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn chắc chắn muốn xoá sản phẩm này?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteRecord(record)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return <Table columns={columns} dataSource={products} />;
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
  const { data: responseVolumes } = useVolume(1);
  const volumes = responseVolumes?.data;
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
  const updateSuccessNotification = () => {
    api.open({
      message: "Cập nhật thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const updateFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Cập nhật thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const [currentEditing, setCurrentEditing] = useState<Product>({
    id: "",
    nameProduct: "",
    description: "",
    categoryId: "",
    activeProduct: false,
    image: "",
    volumes: [],
    canColorPick: true,
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

  if (isLoading) return <Spin />;

  return (
    <div className="ManageProduct">
      {contextHolder}
      <AddProductButton
        volumes={volumes}
        addSuccessNoti={addSuccessNotification}
        addFailNoti={addFailNotification}
        missingAddPropNoti={missingAddPropsNotification}
        categories={categories}
        handleSetNumberInput={handleSetNumberInput}
        refreshProducts={refreshProducts}
        accessToken={accessToken}
        authFetch={authFetch}
      />
      <ProductTable
        volumes={volumes}
        showModal={showModal}
        products={products}
        handleDeleteRecord={handleDeleteRecord}
        categories={categories}
      />
      <UpdateProductModal
        updateSuccessNoti={updateSuccessNotification}
        updateFailNoti={updateFailNotification}
        allVolumes={volumes}
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
