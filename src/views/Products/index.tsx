import { useState } from 'react'
import './index.css'
import { Product } from '../../type'
import { NumberToVND } from '../../helper'
import { useCategories, useProducts } from '../../hooks/useProduct'
import { ITEM_PER_ROW } from '../../constant'

function Products() {
  const { data: categoryResponse } = useCategories(1)
  const { data, mutate: refreshProducts } = useProducts(1)
  const products = data?.data ?? []
  const categories = categoryResponse?.data
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className='Products'>
      <div className='products-container' style={{ gridTemplateColumns: `repeat(${ITEM_PER_ROW}, 1fr)` }}>
        {products.map((item: Product) => (
          <div key={item.id} className='grid-item'>
            <a href={`/product_detail/${item.id}`}><img src={item.image} /></a>
            <div>{item.nameProduct}</div>
            <div>{NumberToVND.format(item.price)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
