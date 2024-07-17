import './index.css'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: 'Danh mục sản phẩm',
    key: 'productCollection',
  },
  {
    label: <Link to='/home'>Trang chủ</Link>,
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
    label: <Link to='/products'>Sản phẩm</Link>,
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
    label: <Link to='/manage/staff'>Quản lý nhân viên</Link>,
    key: 'staff',
  },
  {
    label: <Link to='/manage/agents'>Quản lý đại lý</Link>,
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
    label: <Link to='/manage/products'>Quản lý sản phẩm</Link>,
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
    label: <Link to='/manage/color'>Quản lý màu</Link>,
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
