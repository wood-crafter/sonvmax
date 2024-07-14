import { useState } from 'react'
import { ITEM_PER_ROW, MAIN_COLORS } from '../../constant'
import { useProductsById } from '../../hooks/useProduct'
import { InputNumber } from 'antd';
import './index.css'
import { NumberToVND, compareBrightness, getClosestMainColor } from '../../helper'
import { useLocation } from 'react-router-dom';

const ALL_COLORS = [
  { r: 243, g: 225, b: 216 },
  { r: 169, g: 223, b: 215 },
  { r: 255, g: 0, b: 0 },
  { r: 245, g: 0, b: 0 },
  { r: 235, g: 0, b: 0 },
  { r: 225, g: 0, b: 0 },
  { r: 215, g: 0, b: 0 },
  { r: 205, g: 0, b: 0 },
  { r: 195, g: 0, b: 0 },
  { r: 185, g: 0, b: 0 },
  { r: 175, g: 0, b: 0 },
  { r: 165, g: 0, b: 0 },
  { r: 255, g: 165, b: 0 },
  { r: 245, g: 155, b: 0 },
  { r: 235, g: 145, b: 0 },
  { r: 225, g: 135, b: 0 },
  { r: 215, g: 125, b: 0 },
  { r: 205, g: 115, b: 0 },
  { r: 195, g: 105, b: 0 },
  { r: 185, g: 95, b: 0 },
  { r: 175, g: 85, b: 0 },
  { r: 165, g: 75, b: 0 },
  { r: 255, g: 255, b: 0 },
  { r: 245, g: 245, b: 0 },
  { r: 235, g: 235, b: 0 },
  { r: 225, g: 225, b: 0 },
  { r: 215, g: 215, b: 0 },
  { r: 205, g: 205, b: 0 },
  { r: 195, g: 195, b: 0 },
  { r: 185, g: 185, b: 0 },
  { r: 175, g: 175, b: 0 },
  { r: 165, g: 165, b: 0 },
  { r: 0, g: 128, b: 0 },
  { r: 0, g: 118, b: 0 },
  { r: 0, g: 108, b: 0 },
  { r: 0, g: 98, b: 0 },
  { r: 0, g: 88, b: 0 },
  { r: 0, g: 78, b: 0 },
  { r: 0, g: 68, b: 0 },
  { r: 0, g: 58, b: 0 },
  { r: 0, g: 48, b: 0 },
  { r: 0, g: 38, b: 0 },
  { r: 0, g: 0, b: 255 },
  { r: 0, g: 0, b: 245 },
  { r: 0, g: 0, b: 235 },
  { r: 0, g: 0, b: 225 },
  { r: 0, g: 0, b: 215 },
  { r: 0, g: 0, b: 205 },
  { r: 0, g: 0, b: 195 },
  { r: 0, g: 0, b: 185 },
  { r: 0, g: 0, b: 175 },
  { r: 0, g: 0, b: 165 },
  { r: 128, g: 0, b: 128 },
  { r: 118, g: 0, b: 118 },
  { r: 108, g: 0, b: 108 },
  { r: 98, g: 0, b: 98 },
  { r: 88, g: 0, b: 88 },
  { r: 78, g: 0, b: 78 },
  { r: 68, g: 0, b: 68 },
  { r: 58, g: 0, b: 58 },
  { r: 48, g: 0, b: 48 },
  { r: 38, g: 0, b: 38 },
  { r: 255, g: 192, b: 203 },
  { r: 245, g: 182, b: 193 },
  { r: 235, g: 172, b: 183 },
  { r: 225, g: 162, b: 173 },
  { r: 215, g: 152, b: 163 },
  { r: 205, g: 142, b: 153 },
  { r: 195, g: 132, b: 143 },
  { r: 185, g: 122, b: 133 },
  { r: 175, g: 112, b: 123 },
  { r: 165, g: 102, b: 113 },
  { r: 165, g: 42, b: 42 },
  { r: 155, g: 32, b: 32 },
  { r: 145, g: 22, b: 22 },
  { r: 135, g: 12, b: 12 },
  { r: 125, g: 2, b: 2 },
  { r: 115, g: 0, b: 0 },
  { r: 105, g: 0, b: 0 },
  { r: 95, g: 0, b: 0 },
  { r: 85, g: 0, b: 0 },
  { r: 75, g: 0, b: 0 },
  { r: 128, g: 128, b: 128 },
  { r: 118, g: 118, b: 118 },
  { r: 108, g: 108, b: 108 },
  { r: 98, g: 98, b: 98 },
  { r: 88, g: 88, b: 88 },
  { r: 78, g: 78, b: 78 },
  { r: 68, g: 68, b: 68 },
  { r: 58, g: 58, b: 58 },
  { r: 48, g: 48, b: 48 },
  { r: 38, g: 38, b: 38 },
  { r: 255, g: 255, b: 255 },
  { r: 245, g: 245, b: 245 },
  { r: 235, g: 235, b: 235 },
  { r: 225, g: 225, b: 225 },
  { r: 215, g: 215, b: 215 },
  { r: 205, g: 205, b: 205 },
  { r: 195, g: 195, b: 195 },
  { r: 185, g: 185, b: 185 },
  { r: 175, g: 175, b: 175 },
  { r: 165, g: 165, b: 165 },
  { r: 0, g: 0, b: 0 },
  { r: 10, g: 10, b: 10 },
  { r: 20, g: 20, b: 20 },
  { r: 30, g: 30, b: 30 },
  { r: 40, g: 40, b: 40 },
  { r: 50, g: 50, b: 50 },
  { r: 60, g: 60, b: 60 },
  { r: 70, g: 70, b: 70 },
  { r: 80, g: 80, b: 80 },
  { r: 90, g: 90, b: 90 },
  { r: 0, g: 255, b: 255 },
  { r: 0, g: 245, b: 245 },
  { r: 0, g: 235, b: 235 },
  { r: 0, g: 225, b: 225 },
  { r: 0, g: 215, b: 215 },
  { r: 0, g: 205, b: 205 },
  { r: 0, g: 195, b: 195 },
  { r: 0, g: 185, b: 185 },
  { r: 0, g: 175, b: 175 },
  { r: 0, g: 165, b: 165 },
];

function ProductDetail() {
  const currentProductId = useLocation().pathname.split('/')[2]
  const [currentChildColors, setCurrentChildColors] = useState<any>([])
  const { data: product } = useProductsById(currentProductId)

  const handleChangeMainColor = (colorName: string) => {
    const nextChildColor = ALL_COLORS.filter(item => getClosestMainColor(item) === colorName).sort(compareBrightness)
    setCurrentChildColors(nextChildColor)
  }
  return (
    <div className='ProductDetail'>
      <div className='body'>
        <div className='side-preview'><img src={product?.image}></img></div>
        <div className='main-preview'><img src={product?.image}></img></div>
        <div className='detail'>
          <h3 className='full-width'>{product?.nameProduct}</h3>
          <p className='full-width'>{NumberToVND.format(product?.price ?? 0)}</p>

          <div className='same-type-colors-container'>
            {MAIN_COLORS.map(item => (
              <div
                className='main-color-items'
                onClick={() => { handleChangeMainColor(item.name) }}
                style={{ backgroundColor: `rgb(${item.rgb[0]}, ${item.rgb[1]}, ${item.rgb[2]})`, border: '1px solid black' }}
              >
              </div>
            ))}
          </div>
          <div className='main-color-container' style={{ gridTemplateColumns: `repeat(${ITEM_PER_ROW}, 1fr)` }}>
            {currentChildColors && currentChildColors.map((item: any) => (
              <div className='main-color-items' style={{ backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})` }}></div>
            ))
            }
          </div>
          <h3 style={{ width: '100%' }}>Chi tiết</h3>
          <p className='full-width'>{product?.description}</p>
          <div className='add-to-cart'>
            <InputNumber min={1} max={100000} defaultValue={1} changeOnWheel />
            <button style={{ marginLeft: '1rem' }}>Thêm vào giỏ</button>
          </div>
          <button style={{ backgroundColor: 'black', color: 'white', flexGrow: '0', width: '100%', marginTop: '1rem' }}>Mua ngay</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
