export type StaffInfo = {
  gender: number;
  isActive: boolean;
  username: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  fullName: string;
  phoneNumber: string;
  roleId: string;
  roleName: string
  type: "staff";
};

export type AgentInfo = {
  accountDebit: string;
  accountHave: string;
  address: string;
  agentName: string;
  debitLimit: string;
  email: string;
  rank: number;
  staffId: string;
  taxCode: string;
  username: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  fullName: string;
  phoneNumber: string;
  roleId: string;
  type: "agent";
};

export type Product = {
  id: string
  categoryId: string
  nameProduct: string
  description: string
  activeProduct: boolean
  image: string | undefined
  volumes: ProductVolume[]
  canColorPick: boolean
}

export type Volume = {
  id: string
  volume: string
}

export type ProductVolume = {
  volume: string
  price: number
  id: string
}

export type Color = any

export type Category = {
  id: string
  name: string
  description: string | null
  products: Product[]
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export type Order = {
  agentId: string
  address: string
  phoneNumberCustom: string
  phoneNumber: string
  id: string
  status: number
  totalAmount: number
  confirmBy: string
  description: string | null
  confirmDate: Date | null
  createdAt: Date
  updatedAt: Date
  orderProductSnapshots: any[]
  voucherOrders: {code: string, discountAmount: number}[]
  addressCustom: string
  warehouseOrders?: any
  agentName?: string
}

type InvoiceDetails = {
  agentId: string;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  id: string;
  totalAmount: number
  order: Order
}

export type Invoice = {
  agentId: string;
  agentName: string;
  createdAt: string;
  fullName: string;
  invoice: InvoiceDetails;
  invoiceId: string;
  staffId: string;
  updatedAt: string;
  order: Order
  phoneNumber: string
  address: string
  totalAmount: string
}

export type Ticket = any
export type WarehouseOrders = any

export type PagedResponse<T> = {
  message: string
  page: number
  size: number
  totalRecord: number
  totalPage: number
  data: T[]
}

export type Transaction = {
  agentId: string;
  createdAt: string;
  description: string | null;
  id: string;
  image: string;
  paymentDate: string;
  staffId: string | null;
  status: number;
  totalAmount: string;
  updatedAt: string;
  updatedBy: string;
};

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
  staffId: string
  address: string
  orders: Order[]
  invoice: any[]
  transactions: any[]
  role: Role
}

export type Role = {
  id: string
  name: string
  staff: Staff[]
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
  email: string
}

export type Sales = {
  id: string
  roleId: string
  fullName: string
  phoneNumber: string
  isActive: boolean
  gender: number
  username: string
}

export type Voucher = {
  id: string
  code: string
  activeVoucher: boolean
  discountAmount: number
  createdAt: string
  agentId: string
}

export type RGB = {
  r: number
  g: number
  b: number
}

export type LoginBody = {
  username: string
  password: string
}

export type ChildColor = {
  id: number
  colorName: string
  colorType: string
  parentId: string
  r: number
  g: number
  b: number
  priceColor: number
}

export type Cart = {
  id: string;
  orderId: string | null;
  productId: string;
  colorId: number | null;
  staffId: string;
  agentId: string;
  quantity: number;
  price: number;
  product: Product;
  colors: Color | null;
  colorPick: {
    r: number,
    g: number,
    b: number
  }
  color: CartColor
  volumeId: string
  originalPrice: number
}

type CartColor = {
  code: string
  colorName: string
  priceColor: number
  r: number
  g: number
  b: number
}
