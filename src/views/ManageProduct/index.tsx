import { useState } from 'react'
import './index.css'
import { Table, Space, Button, Modal, notification } from "antd"
import { ColumnType } from 'antd/es/table'
import { SmileOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { API_ROOT } from '../../constant'

type Product = {
  id: string
  categoryId: string
  nameProduct: string
  price: number
  description: string | null
  volume: number | null
  activeProduct: boolean
  quantity: number
  image: string | null
}

type Category = {
  id: string
  name: string
  description: string | null
  products: Product[]
}

type PagedResponse<T> = {
  message: string
  page: number
  size: number
  totalRecord: number
  totalPage: number
  data: T[]
}

type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: string
  [key: string]: any
}

const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    "Access-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoidGFrYWhpcm8ubWl5YW1vdG9Abm9yaXRzdS5jb20iLCJyb2xlIjowLCJsb2dpbkluZm9JZCI6MjgsImN1c3RvbWVySWQiOjY4LCJzdG9yZUNvZGUiOiJNaXlhbW90byIsImlhdCI6MTcxODMyNTI2MiwiZXhwIjoxNzE4NDExNjYyfQ.Qb8cpuRO6ZyPaHXIznrJq1HqmmkLLdhG9LHC0C9otcs"
  }
}

function useCategories(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(`/category/get-category?page=${page}&size=${size}`, fetchCategories)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

async function fetchCategories(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Category>>
}

function useProducts(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(`/product/get-product?page=${page}&size=${size}`, fetchProducts)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

async function fetchProducts(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Product>>
}

async function updateProduct(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Product>
}

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
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(0)
  const [category, setCategory] = useState<string>('')

  const [nextProductName, setNextProductName] = useState('')
  const [nextProductDescription, setNextProductDescription] = useState('')
  const [nextPrice, setNextPrice] = useState(0)
  const [nextQuantity, setNextQuantity] = useState(0)
  const [nextCategory, setNextCategory] = useState('sb')

  const [currentEditing, setCurrentEditing] = useState<Product | null>(null)
  const handleUpdateProduct = async () => {
    const updateData = {
      ...currentEditing,
      categoryId: category,
      price: price,
      nameProduct: productName,
      quantity: quantity,
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
    setPrice(record.price)
    setQuantity(record.quantity)
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

  const handleDeleteRecord = (_record: Product) => {
    refreshProducts()
    // setData((data: Product[]) => {
    //   return data.filter(item => {
    //     return item.id !== record.id
    //   })
    // })
  }

  const clearAddInput = () => {
    setNextProductName('')
    setQuantity(0)
    setNextPrice(0)
    setNextProductDescription('')
    setCategory('sb')
  }

  const handleAddOk = () => {
    if (!nextProductName || !nextProductDescription || !nextPrice || !nextCategory || !nextQuantity) {
      openNotification()
      return
    }
    // setData((data: Product[]) => {
    //   const next = [...data]
    //   next.push({
    //     id: (Math.random() + 1).toString(36),
    //     category: nextCategory,
    //     categoryId: (Math.random() + 1).toString(36),
    //     price: nextPrice,
    //     nameProduct: nextProductName,
    //     description: nextProductDescription,
    //     quantity: nextQuantity,
    //     image: (Math.random() + 1).toString(36),
    //   })
    //   return next
    // })
    clearAddInput()
    setIsAddModalOpen(false)
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

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
            <input value={productName} type="text" placeholder={currentEditing.nameProduct} onChange={(e) => { setProductName(e.target.value) }} name='product-name' />
            <label htmlFor="price">Giá: </label>
            <input value={price} type="number" placeholder={currentEditing.price.toString()} onChange={(e) => { setPrice(+e.target.value) }} name='price' />
            <label htmlFor="product-name">Số lượng: </label>
            <input value={quantity} type="number" placeholder={currentEditing.quantity.toString()} onChange={(e) => { setQuantity(+e.target.value) }} name='quantity' />
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
          <input value={nextProductName} type="text" placeholder='Thêm tên sản phẩm' onChange={(e) => { setNextProductName(e.target.value) }} name='product-name' />
          <label htmlFor="price">Giá: </label>
          <input value={nextPrice} type="number" onChange={(e) => { setNextPrice(+e.target.value) }} name='price' />
          <label htmlFor="product-name">Số lượng: </label>
          <input value={nextQuantity} type="number" onChange={(e) => { setNextQuantity(+e.target.value) }} name='quantity' />
          <label htmlFor="product-description">Chi tiết: </label>
          <input value={nextProductDescription} type="text" placeholder='Thêm chi tiết' onChange={(e) => { setNextProductDescription(e.target.value) }} name='product-description' />
          <label htmlFor="category">Loại sản phẩm</label>
          <select value={nextCategory} id="category" name="category" onChange={(e) => { setNextCategory(e.target.value) }}>
            {categories && categories.map((category: Category) => {
              return <option value={category.id}>{category.name}</option>
            })}
          </select>
        </div>
      </Modal>
    </div>
  )
}

export default ManageProduct
