import { useState } from 'react'
import { ITEM_PER_ROW, MAIN_COLORS } from '../../constant'
import { useProductsById } from '../../hooks/useProduct'
import { InputNumber } from 'antd';
import './index.css'
import { NumberToVND, compareBrightness, getClosestMainColor } from '../../helper'
import { useLocation } from 'react-router-dom';
import { useColors } from '../../hooks/useColor';

function ProductDetail() {
  const { data: colors } = useColors()
  const currentProductId = useLocation().pathname.split('/')[2]
  const [currentChildColors, setCurrentChildColors] = useState<any>([])
  const { data: product } = useProductsById(currentProductId)

  const handleChangeMainColor = (colorName: string, colorType: string) => {
    const colorInGroup = colors.find(it => it[0].type === colorType)
    const nextChildColor = colorInGroup?.find(it => it.name === colorName)
    setCurrentChildColors(nextChildColor?.childs.sort(compareBrightness))
  }

  const handleAddToCart = () => {

  }

  const handleBuyNow = () => {

  }

  return (
    <div className='ProductDetail'>
      <div className='body'>
        <div className='side-preview'><img src={product?.image}></img></div>
        <div className='main-preview'><img src={product?.image}></img></div>
        <div className='detail'>
          <h3 className='full-width'>{product?.nameProduct}</h3>
          <p className='full-width'>{NumberToVND.format(product?.price ?? 0)}</p>
          {colors.length !== 0 && (
            <div className='colors-container'>{
              colors.map((it) => {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'start', marginRight: '1rem', marginLeft: '1rem' }}>
                    <h5>{it[0].type}</h5>
                    <div className='same-type-colors-container'>
                      {it.map(item => (
                        <div
                          className='main-color-items'
                          onClick={() => { handleChangeMainColor(item.name, item.type) }}
                          style={{ backgroundColor: `rgb(${item.rgb[0]}, ${item.rgb[1]}, ${item.rgb[2]})`, border: '1px solid black' }}
                        >
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            }</div>
          )}
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
            <button style={{ marginLeft: '1rem' }} onClick={handleAddToCart}>Thêm vào giỏ</button>
          </div>
          <button style={{ backgroundColor: 'black', color: 'white', flexGrow: '0', width: '100%', marginTop: '1rem' }} onClick={handleBuyNow}>Mua ngay</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
