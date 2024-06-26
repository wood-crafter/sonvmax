import { useState } from 'react'
import './index.css'
import { Table, Space, Button, Modal, notification, Input } from "antd"
import { ColumnType } from 'antd/es/table'
import { SmileOutlined } from '@ant-design/icons'
import { Category, Product } from '../../type'
import { useCategories, useProducts, updateProduct, deleteProduct, addProduct, requestOptions } from '../../hooks/useProduct'

function ManageProduct() {
  const [api, contextHolder] = notification.useNotification()
  const { data: categoryResponse } = useCategories(1)
  const { data, mutate: refreshProducts } = useProducts(1)
  const products = data?.data ?? []
  const categories = categoryResponse?.data

  const openNotification = () => {
    api.open({
      message: 'Tạo thất bại',
      description:
        'Vui lòng điền đủ thông tin',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  }
  const [productName, setProductName] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [category, setCategory] = useState<string>('')

  const [nextProductName, setNextProductName] = useState('')
  const [nextProductDescription, setNextProductDescription] = useState('')
  const [nextPrice, setNextPrice] = useState('')
  const [nextQuantity, setNextQuantity] = useState('')
  const [nextCategory, setNextCategory] = useState(categories ? categories[0].id : '')

  const [currentEditing, setCurrentEditing] = useState<Product | null>(null)
  const handleUpdateProduct = async () => {
    const updateData = {
      ...currentEditing,
      categoryId: category,
      price: +price,
      nameProduct: productName,
      quantity: +quantity,
    }
    const updateBody = JSON.stringify(updateData)

    await updateProduct(
      `/product/update-product/${currentEditing?.id}`,
      { ...requestOptions, body: updateBody, method: "PUT", headers: { 'Content-Type': 'application/json' } }
    )
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Product) => {
    setCurrentEditing(record)
    setProductName(record.nameProduct)
    setPrice(record.price.toString())
    setQuantity(record.quantity.toString())
    setCategory(record.categoryId)
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleUpdateProduct()
    refreshProducts()
    setIsModalOpen(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRecord = async (record: Product) => {
    await deleteProduct(`/product/remove-product/${record.id}`, { ...requestOptions, method: 'DELETE' })
    refreshProducts()
  }

  const clearAddInput = () => {
    setNextProductName('')
    setQuantity('')
    setNextPrice('')
    setNextProductDescription('')
    setCategory(categories ? categories[0].id : '')
  }

  const handleAddOk = async () => {
    if (!nextProductName || !nextProductDescription || !nextPrice || !nextCategory || !nextQuantity) {
      openNotification()
      return
    }
    const productToAdd = JSON.stringify({
      price: +nextPrice,
      nameProduct: nextProductName,
      description: nextProductDescription,
      quantity: +nextQuantity,
      image: null,
      volume: null,
      activeProduct: true,
    })

    await addProduct(
      `/product/create-product/${nextCategory}`,
      { ...requestOptions, body: productToAdd, method: "POST", headers: { 'Content-Type': 'application/json' } }
    )
    refreshProducts()
    clearAddInput()
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleSetNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      setter(inputValue);
    }
  }

  const columns: ColumnType<Product>[] = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'nameProduct',
      key: 'nameProduct',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <div>{price}</div>
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (value: string) => (
        <div>{categories?.find(it => it.id === value)?.name}</div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Product) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>Update</Button>
          <Button onClick={() => handleDeleteRecord(record)}>Delete</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className='ManageProduct'>
      {contextHolder}
      <Button onClick={() => { setIsAddModalOpen(true) }} type="primary" style={{ marginBottom: 16 }}>
        Thêm sản phẩm
      </Button>
      <Table columns={columns} dataSource={products} />
      <Modal title="Sửa sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {currentEditing && (
          <div className='modal-update-container'>
            <label htmlFor="product-name">Tên sản phẩm: </label>
            <Input value={productName} type="text" placeholder={currentEditing.nameProduct} onChange={(e) => { setProductName(e.target.value) }} name='product-name' />
            <label htmlFor="price">Giá: </label>
            <Input
              name='price'
              value={price}
              onChange={(e) => { handleSetNumberInput(e, setPrice) }}
              placeholder={currentEditing.price.toString()}
              maxLength={16}
            />
            <label htmlFor="quantity">Số lượng: </label>
            <Input
              name='quantity'
              value={quantity}
              onChange={(e) => { handleSetNumberInput(e, setQuantity) }}
              placeholder={currentEditing.quantity.toString()}
              maxLength={16}
            />
            <label htmlFor="category">Loại sản phẩm</label>
            <select value={category} id="category" name="category" onChange={(e) => { setCategory(e.target.value) }}>
              {categories && categories.map((category: Category) => {
                return <option value={category.id}>{category.name}</option>
              })}
            </select>
          </div>
        )}
      </Modal>

      <Modal title="Thêm sản phẩm" open={isAddModalOpen} onOk={handleAddOk} onCancel={handleAddCancel}>
        <div className='modal-update-container'>
          <label htmlFor="product-name">Tên sản phẩm: </label>
          <Input value={nextProductName} type="text" placeholder='Thêm tên sản phẩm' onChange={(e) => { setNextProductName(e.target.value) }} name='product-name' />
          <label htmlFor="price">Giá: </label>
          <Input
            name='price'
            value={nextPrice}
            onChange={(e) => { handleSetNumberInput(e, setNextPrice) }}
            placeholder={nextPrice.toString()}
            maxLength={16}
          />
          <label htmlFor="product-name">Số lượng: </label>
          <Input
            name='quantity'
            value={nextQuantity}
            onChange={(e) => { handleSetNumberInput(e, setNextQuantity) }}
            placeholder={nextQuantity}
            maxLength={16}
          />
          <label htmlFor="product-description">Chi tiết: </label>
          <Input value={nextProductDescription} type="text" placeholder='Thêm chi tiết' onChange={(e) => { setNextProductDescription(e.target.value) }} name='product-description' />
          <label htmlFor="category">Loại sản phẩm</label>
          <select value={nextCategory} id="category" name="category" onChange={(e) => { setNextCategory(e.target.value) }}>
            <option value="" disabled selected>Chọn loại sơn</option>
            {categories && categories.map((category: Category) => {
              return <option key={category.id} value={category.id}>{category.name}</option>
            })}
          </select>
        </div>
      </Modal>
    </div>
  )
}

export default ManageProduct
