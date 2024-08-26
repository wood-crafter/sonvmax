export const HOME_TOP_BANNERS = [
  "bg_cover_newa14d.jpg",
  "bg_cover_new_2a14d.jpg",
  "bg_cover_new_1a14d.jpg",
];

export const ITEM_PER_ROW = 5;

export const MAIN_COLORS = [
  { name: "Red", rgb: [255, 0, 0] },
  { name: "Orange", rgb: [255, 165, 0] },
  { name: "Yellow", rgb: [255, 255, 0] },
  { name: "Green", rgb: [0, 128, 0] },
  { name: "Blue", rgb: [0, 0, 255] },
  { name: "Purple", rgb: [128, 0, 128] },
  { name: "Pink", rgb: [255, 192, 203] },
  { name: "Brown", rgb: [165, 42, 42] },
  { name: "Gray", rgb: [128, 128, 128] },
  { name: "White", rgb: [255, 255, 255] },
  { name: "Black", rgb: [0, 0, 0] },
  { name: "Cyan", rgb: [0, 255, 255] },
];

export const API_ROOT = "https://vmaxpaint.com";

export const ADMIN_ROLES = ["OWNER", "SALES", "ACCOUNTANT", "STOCKER"];

export const OWNER = {
  role: 'OWNER',
  defaultPath: '/manage/products'
}

export const SALES = {
  role: 'SALES',
  defaultPath: '/manage/orders'
}

export const ACCOUTANT = {
  role: 'ACCOUNTANT',
  defaultPath: '/manage/orders'
}

export const STOCKER = {
  role: 'STOCKER',
  defaultPath: '/manage/ticket'
}

export const AGENT = {
  role: 'AGENT',
  defaultPath: '/'
}

export const DISCOUNT_AMOUNT = [40, 30, 20]
