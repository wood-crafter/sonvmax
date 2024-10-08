import { useEffect, useMemo, useRef, useState } from "react";
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
  InputRef,
} from "antd";
import type { ColumnType } from "antd/es/table";
import {
  SmileOutlined,
  FrownOutlined,
  QuestionCircleOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Category,
  PagedResponse,
  Product,
  ProductVolume,
  Volume,
} from "../../type";
import { NumberToVND } from "../../helper";
import { useProducts } from "../../hooks/useProduct";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { API_ROOT } from "../../constant";
import { KeyedMutator } from "swr";
import TextArea from "antd/es/input/TextArea";
import { useVolume } from "../../hooks/useVolume";
import { requestOptions } from "../../hooks/utils";
import { useCategories } from "../../hooks/useCategories";

type AddProductButtonProps = {
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsApiCalling: React.Dispatch<React.SetStateAction<boolean>>;
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
  missingUpdatePriceNoti: () => void;
  allVolumes: Volume[] | undefined;
};

type ProductTableProps = {
  products: Product[] | undefined;
  categories: Category[] | undefined;
  volumes: Volume[] | undefined;
  showModal: (record: Product) => void;
  handleDeleteRecord: (record: Product) => Promise<void>;
  isApiCalling: boolean;
};

const getDefaultSelectedVolumePrices = (products: Product[] | undefined) => {
  const defaultSelectedVolumePrices: {
    [key: string]: number;
  } = {};

  products?.forEach((product) => {
    defaultSelectedVolumePrices[product.id] = product.volumes[0]?.price;
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
    setIsApiCalling,
  } = props;
  const [nextProductName, setNextProductName] = useState("");
  const [nextImage, setNextImage] = useState<string>("");
  const [nextProductDescription, setNextProductDescription] = useState("");
  const [nextVolumes, setNextVolumes] = useState<ProductVolume[]>([
    { id: "", price: 0, volume: "" },
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
    setNextVolumes([{ id: "", price: 0, volume: "" }]);
    setNextProductDescription("");
    setNextCategory(categories ? categories[0].id : "");
  };

  const isNextVolumesFullfilled = () => {
    let isFullfilled = true;
    nextVolumes.forEach((volume) => {
      if (+volume?.price === 0 || !volume.id) {
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

    setIsApiCalling(true);
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
    setIsApiCalling(false);
    if (!createResponse.ok) {
      const resJson = await createResponse.json();
      addFailNoti(createResponse.status, resJson?.message);
    } else {
      addSuccessNoti();
      setIsModalOpen(false);
      clearAddInput();
      setIsModalOpen(false);
      refreshProducts();
    }
  };
  const handleAddCancel = () => {
    setIsModalOpen(false);
    clearAddInput();
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
          <label htmlFor="product-name" style={{ display: "flex" }}>
            Tên sản phẩm:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
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
                <label htmlFor="price" style={{ display: "flex" }}>
                  Khối lượng {index + 1}:{" "}
                  <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
                </label>
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

                <label htmlFor="price" style={{ display: "flex" }}>
                  Giá {index + 1}:{" "}
                  <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
                </label>
                <Input
                  value={it?.price}
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
                            { id: "", price: 0, volume: "" },
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
          <label htmlFor="product-name" style={{ display: "flex" }}>
            Link ảnh sản phẩm:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={nextImage}
            type="text"
            placeholder="Thêm ảnh sản phẩm"
            onChange={(e) => {
              setNextImage(e.target.value);
            }}
            name="product-name"
          />
          <label htmlFor="product-description" style={{ display: "flex" }}>
            Chi tiết:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <TextArea
            value={nextProductDescription}
            placeholder="Thêm chi tiết"
            onChange={(e) => {
              setNextProductDescription(e.target.value);
            }}
            autoSize={{ minRows: 5, maxRows: 30 }}
            name="product-description"
          />

          <label htmlFor="category" style={{ display: "flex" }}>
            Loại sản phẩm{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Select
            value={nextCategory}
            id="category"
            onChange={(value) => {
              setNextCategory(value);
            }}
          >
            <option value="" disabled selected>
              Chọn loại sơn
            </option>
            {categories?.map((category: Category) => {
              return (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              );
            })}
          </Select>
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
    missingUpdatePriceNoti,
    setIsApiCalling,
  } = props;

  const [productName, setProductName] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [volumes, setVolumes] = useState<ProductVolume[]>([
    { id: "", price: 0, volume: "" },
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
            return { id: it.id, price: it?.price, volume: it.volume };
          })
        : [{ id: "", price: 0, volume: "" }]
    );
    setDescription(currentEditing.description);
    setCategory(currentEditing.categoryId);
    setActiveProduct(currentEditing.activeProduct);
    setImage(currentEditing.image);
    setCanColorPick(currentEditing.canColorPick);
  }, [currentEditing]);

  const handleUpdateProduct = async () => {
    for (let i = 0; i < volumes.length; i++) {
      if (
        (volumes[i].id && !volumes[i]?.price) ||
        (volumes[i].id && volumes[i]?.price <= 0)
      ) {
        missingUpdatePriceNoti();
        return;
      }
    }

    const updateData = {
      categoryId: category,
      volumes: volumes.filter((volume) => volume.id && volume.price),
      nameProduct: productName,
      description: description,
      activeProduct: activeProduct,
      image: image,
      id: currentEditing?.id,
      canColorPick: canColorPick,
    };
    const updateBody = JSON.stringify(updateData);

    setIsApiCalling(true);
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

    setIsApiCalling(false);
    if (updateResponse.ok) {
      updateSuccessNoti();
      refreshProducts();
      setIsModalOpen(false);
    } else {
      const resJson = await updateResponse.json();
      updateFailNoti(updateResponse.status, resJson.message);
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
          <label htmlFor="product-name" style={{ display: "flex" }}>
            Tên sản phẩm:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={productName}
            type="text"
            placeholder={currentEditing.nameProduct}
            onChange={(e) => {
              setProductName(e.target.value);
            }}
            name="product-name"
          />
          <label htmlFor="product-image" style={{ display: "flex" }}>
            Link ảnh sản phẩm:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Input
            value={image}
            type="text"
            placeholder={currentEditing.image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
            name="product-image"
          />
          {volumes.length !== 0 &&
            volumes.map((volume, index) => (
              <div key={index}>
                <label htmlFor="volume" style={{ display: "flex" }}>
                  Khối lượng {index + 1}:{" "}
                  <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
                </label>
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
                <label htmlFor="price" style={{ display: "flex" }}>
                  Giá {index + 1}:{" "}
                  <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
                </label>
                <Input
                  value={volume?.price}
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
                    { id: "", price: 0, volume: "" },
                  ]);
                }}
                type="primary"
                icon={<PlusSquareOutlined />}
                style={{ marginTop: "1rem" }}
              />
            </div>
          )}
          <label htmlFor="product-description" style={{ display: "flex" }}>
            Chi tiết sản phẩm:{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <TextArea
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder={currentEditing.description}
            autoSize={{ minRows: 5, maxRows: 30 }}
          />
          <label htmlFor="category" style={{ display: "flex" }}>
            Loại sản phẩm{" "}
            <div style={{ color: "red", marginLeft: "0.2rem" }}>*</div>
          </label>
          <Select
            value={category}
            id="category"
            onChange={(value) => {
              setCategory(value);
            }}
          >
            {categories?.map((category: Category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
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
  const {
    products,
    categories,
    volumes,
    showModal,
    handleDeleteRecord,
    isApiCalling,
  } = props;
  const [selectedVolumePrices, setSelectedVolumePrices] = useState<{
    [key: string]: number;
  }>(getDefaultSelectedVolumePrices(products));
  const searchInput = useRef<InputRef | null>(null);

  useEffect(() => {
    setSelectedVolumePrices(getDefaultSelectedVolumePrices(products));
  }, [products]);

  const handleVolumeChange = (productId: string, price: number) => {
    setSelectedVolumePrices((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  const columns: ColumnType<Product>[] = useMemo(() => {
    // Create filters for category and activeProduct
    const categoryFilters =
      categories?.map((cat) => ({
        text: cat.name,
        value: cat.id,
      })) || [];

    const activeProductFilters = [
      { text: "Hoạt động", value: true },
      { text: "Tạm dừng", value: false },
    ];

    return [
      {
        title: "Tên sản phẩm",
        dataIndex: "nameProduct",
        key: "nameProduct",
        sorter: (a, b) => a.nameProduct.localeCompare(b.nameProduct),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={searchInput}
              placeholder="Tìm tên sản phẩm"
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
                Tìm kiếm
              </Button>
              <Button
                onClick={() => clearFilters && clearFilters()}
                size="small"
                style={{ width: 90 }}
              >
                Bỏ lựa chọn
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
          record.nameProduct
            .toLowerCase()
            .includes((value as string).toLowerCase()),
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
        filters: categoryFilters,
        onFilter: (value, record) => record.categoryId === value,
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
        filters: activeProductFilters,
        onFilter: (value, record) => record.activeProduct === value,
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
  }, [
    categories,
    selectedVolumePrices,
    volumes,
    showModal,
    handleDeleteRecord,
  ]);
  return (
    <Spin spinning={isApiCalling}>
      <Table columns={columns} dataSource={products} />
    </Spin>
  );
}

function ManageProduct() {
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const { data: categoryResponse } = useCategories(1);
  const { data, isLoading, mutate: refreshProducts } = useProducts(1, 99999);
  const [isApiCalling, setIsApiCalling] = useState(false);
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

  const missingUpdatePriceNoti = () => {
    api.open({
      message: "Cập nhật thất bại",
      description: "Vui lòng điền đúng giá cho mỗi khối lượng",
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
    setIsApiCalling(true);
    const res = await authFetch(
      `${API_ROOT}/product/remove-product/${record.id}`,
      {
        ...requestOptions,
        method: "DELETE",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setIsApiCalling(false);

    if (res.ok) {
      api.open({
        message: "Xóa thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      refreshProducts();
    } else {
      const resJson = await res.json();
      api.open({
        message: "Xóa thất bại",
        description: resJson?.message,
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
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
      <h2 style={{ color: "black" }}>Quản lý sản phẩm</h2>
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
        setIsApiCalling={setIsApiCalling}
      />
      <ProductTable
        volumes={volumes}
        showModal={showModal}
        products={products}
        handleDeleteRecord={handleDeleteRecord}
        categories={categories}
        isApiCalling={isApiCalling}
      />
      <UpdateProductModal
        missingUpdatePriceNoti={missingUpdatePriceNoti}
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
        setIsApiCalling={setIsApiCalling}
      />
    </div>
  );
}

export default ManageProduct;
