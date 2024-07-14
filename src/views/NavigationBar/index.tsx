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
    label: <a href='/home'>Trang chủ</a>,
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
    label: <a href='/products'>Sản phẩm</a>,
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
    label: <a href='/manage/staff'>Quản lý nhân viên</a>,
    key: 'staff',
  },
  {
    label: <a href='/manage/agents'>Quản lý đại lý</a>,
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
  {
    label: <a href='/manage/color'>Quản lý màu</a>,
    key: 'color',
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
