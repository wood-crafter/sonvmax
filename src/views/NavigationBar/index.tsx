import './index.css'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: 'Navigation One',
    key: 'mail',
  },
  {
    label: 'Navigation Two',
    key: 'app',
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
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
