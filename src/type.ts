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

export type Agent = {
  id: string
  roleId: string
  email: string
  username: string
  password: string
  rank: number
  taxCode: string
  phoneNumber: string
  fullName: string
  agentName: string
  debitLimit: number
  accountHave: number
  accountDebit: number
  address: string
  orders: any[]
  invoice: any[]
  transactions: any[]
  role: Role
}

export type Role = {
  id: string
  name: string
  staff: any[]
  agent: Agent[]
}
