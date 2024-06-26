import './index.css'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: 'Danh mục sản phẩm',
    key: 'productCollection',
  },
  {
    label: 'Home',
    key: 'home',
  },
  {
    label: 'Giới thiệu',
    key: 'introduce',
  },
  {
    label: 'Tin tức',
    key: 'news',
  },
  {
    label: 'Sản phẩm',
    key: 'products',
  },
  {
    label: 'Dự án',
    key: 'project',
  },
  {
    label: 'Tư vấn',
    key: 'advise',
  },
  {
    label: 'Hợp tác',
    key: 'cooperate'
  },
];

const managerItems: MenuItem[] = [
  {
    label: 'Quản lý nhân viên',
    key: 'staff',
  },
  {
    label: 'Quản lý đại lý',
    key: 'agent',
  },
  {
    label: 'Quản lý voucher',
    key: 'voucher',
  },
  {
    label: 'Quản lý đơn',
    key: 'order',
  },
  {
    label: <a href='/manage/products'>Quản lý sản phẩm</a>,
    key: 'product'
  },
  {
    label: 'Quản lý hóa đơn',
    key: 'invoice',
  },
  {
    label: 'Quản lý phiếu',
    key: 'ticket',
  },
  {
    label: 'Hồ sơ',
    key: 'profile',
  },
];

function Nav({ isManager = false }: { isManager: boolean }) {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode={isManager ? "vertical" : "horizontal"}
      items={isManager ? managerItems : items}
    />
  )
}

export default Nav
