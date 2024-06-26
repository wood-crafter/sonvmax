export type Product = {
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

export type Category = {
  id: string
  name: string
  description: string | null
  products: Product[]
}

export type PagedResponse<T> = {
  message: string
  page: number
  size: number
  totalRecord: number
  totalPage: number
  data: T[]
}

export type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: string
  [key: string]: any
}
