import { useState } from 'react'
import './index.css'
import { Table, Space, Button, Modal, notification } from "antd"
import { ColumnType } from 'antd/es/table'
import { SmileOutlined } from '@ant-design/icons'

type Product = {
  id: string,
  category: string,
  categoryId: string,
  price: number,
  nameProduct: string,
  description: string,
  quantity: number,
  image: string,
}

const categories = [
  { id: 'sb', title: 'Son Bong' },
  { id: 'skb', title: 'Son Khong Bong' },
]

const products: Product[] = [
  {
    id: 'clxqe023n0001642g500anxnv',
    categoryId: 'clxqdzfuc0000642gs8xlu7dq',
    nameProduct: 'Son bong 1',
    price: 200,
    description: 'Son bong 1',
    quantity: 2000,
    image: 'image',
    category: 'sb',
  },
  {
    id: 'clxqe023n0001642g500anxnx',
    categoryId: 'clxqdzfuc0000642gs8xlu7dq',
    nameProduct: 'Son khong bong 1',
    price: 300,
    description: 'Son khong bong 1',
    quantity: 3000,
    image: 'image',
    category: 'skb',
  }
]

function ManageProduct() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Tạo thất bại',
      description:
        'Vui lòng điền đủ thông tin',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  }
  const [data, setData] = useState(products)
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [category, setCategory] = useState('')

  const [nextProductName, setNextProductName] = useState('')
  const [nextProductDescription, setNextProductDescription] = useState('')
  const [nextPrice, setNextPrice] = useState(0)
  const [nextQuantity, setNextQuantity] = useState(0)
  const [nextCategory, setNextCategory] = useState('sb')

  const [currentEditing, setCurrentEditing] = useState<Product | null>(null)
  const handleUpdateProduct = () => {
    setData((data: Product[]): Product[] => {
      return data.map((item: Product) => {
        if (item.id === currentEditing?.id) {
          const updateProduct = { ...currentEditing }
          updateProduct.category = category
          updateProduct.price = price
          updateProduct.nameProduct = productName
          updateProduct.quantity = quantity
          return updateProduct
        }
        return item
      })
    })
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showModal = (record: Product) => {
    setCurrentEditing(record)
    setProductName(record.nameProduct)
    setPrice(record.price)
    setQuantity(record.quantity)
    setCategory(record.category)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleUpdateProduct()
    setIsModalOpen(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteRecord = (record: Product) => {
    setData((data: Product[]) => {
      return data.filter(item => {
        return item.id !== record.id
      })
    })
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
    setData((data: Product[]) => {
      const next = [...data]
      next.push({
        id: (Math.random() + 1).toString(36),
        category: nextCategory,
        categoryId: (Math.random() + 1).toString(36),
        price: nextPrice,
        nameProduct: nextProductName,
        description: nextProductDescription,
        quantity: nextQuantity,
        image: (Math.random() + 1).toString(36),
      })
      return next
    })
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
      dataIndex: 'category',
      key: 'category',
      render: (value: string) => (
        <div>{categories.find(it => it.id === value).title}</div>
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
      <Table columns={columns} dataSource={data} />
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
              <option value="sb">Son Bong</option>
              <option value="skb">Son Khong Bong</option>
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
            <option value="sb">Son Bong</option>
            <option value="skb">Son Khong Bong</option>
          </select>
        </div>
      </Modal>
    </div>
  )
}

export default ManageProduct
