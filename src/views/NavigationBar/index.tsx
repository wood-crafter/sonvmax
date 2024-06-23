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

function Nav() {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };
  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  )
}

export default Nav
