export type Product = {
  id: string
  categoryId: string
  nameProduct: string
  price: number
  description: string
  volume: number | undefined
  activeProduct: boolean
  quantity: number
  image: string | undefined
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

export type Staff = {
  id: string
  roleId: string
  fullName: string
  phoneNumber: string
  isActive: boolean
  gender: number
  username: string
  password: string
  role: Role
}
