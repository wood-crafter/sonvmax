import "./index.css";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/user";
import {
  ShoppingCartOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  ProductOutlined,
  FormatPainterOutlined,
  BgColorsOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  ClusterOutlined,
  PercentageOutlined,
  TruckOutlined,
  ProfileOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useCategories } from "../../hooks/useProduct";

type MenuItem = Required<MenuProps>["items"][number];

const managerItems: MenuItem[] = [
  {
    label: <Link to="/manage/staff">Quản lý nhân viên</Link>,
    key: "staff",
    icon: <TeamOutlined />,
  },
  {
    label: <Link to="/manage/agents">Quản lý đại lý</Link>,
    key: "agent",
    icon: <CustomerServiceOutlined />,
  },
  {
    label: <Link to="/manage/roles">Quản lý roles</Link>,
    key: "roles",
    icon: <ClusterOutlined />,
  },
  {
    label: <Link to="/manage/voucher">Quản lý voucher</Link>,
    key: "voucher",
    icon: <PercentageOutlined />,
  },
  {
    label: <Link to="/manage/orders">Quản lý đơn</Link>,
    key: "order",
    icon: <TruckOutlined />,
  },
  {
    label: <Link to="/manage/products">Quản lý sản phẩm</Link>,
    key: "product",
    icon: <ProductOutlined />,
  },
  {
    label: "Quản lý hóa đơn",
    key: "invoice",
  },
  {
    label: "Hồ sơ",
    key: "profile",
    icon: <ProfileOutlined />,
  },
  {
    label: <Link to="/manage/color">Quản lý màu</Link>,
    key: "color",
    icon: <FormatPainterOutlined />,
  },
];

function Nav({ isManager = false }: { isManager: boolean }) {
  const { data: categoryResponse } = useCategories(1);
  const accessToken = useUserStore((state) => state.accessToken);
  const logout = useUserStore((state) => state.clear);
  const [current, setCurrent] = useState("mail");

  const getMenuItem = (accessToken: string, basicMenu: MenuItem[]) => {
    const nextMenuItems = [...basicMenu];
    if (accessToken) {
      if (!isManager) {
        nextMenuItems.push({
          label: <Link to="/cart">Giỏ hàng</Link>,
          key: "cart",
          icon: <ShoppingCartOutlined />,
        });
        nextMenuItems.push({
          label: <Link to="/order/history">Lịch sử mua</Link>,
          key: "orderHistory",
          icon: <HistoryOutlined />,
        });
      }
      nextMenuItems.push({
        label: <Link to="/profile">Hồ sơ</Link>,
        key: "profile",
        icon: <ProfileOutlined />,
      });
      nextMenuItems.push({
        label: <div onClick={logout}>Đăng xuất</div>,
        key: "logout",
      });
    } else {
      nextMenuItems.push({
        label: <Link to="/login">Đăng nhập</Link>,
        key: "login",
      });
    }
    return nextMenuItems;
  };
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const items = useMemo(() => {
    return [
      {
        label: "Danh mục sản phẩm",
        key: "productCollection",
        icon: <UnorderedListOutlined />,
        children: categoryResponse
          ? categoryResponse.data.map((it) => {
              return {
                label: <Link to={`/products/${it.id}`}>{it.name}</Link>,
                key: it.id,
              };
            })
          : [],
      },
      {
        label: <Link to="/home">Trang chủ</Link>,
        key: "home",
        icon: <HomeOutlined />,
      },
      {
        label: <Link to="/products">Sản phẩm</Link>,
        key: "products",
        icon: <BgColorsOutlined />,
      },
    ];
  }, [categoryResponse]);
  return (
    <Menu
      className={`${isManager ? "" : "home-menubar"}`}
      onClick={onClick}
      selectedKeys={[current]}
      mode={isManager ? "vertical" : "horizontal"}
      items={
        isManager
          ? getMenuItem(accessToken, managerItems)
          : getMenuItem(accessToken, items)
      }
      style={{
        backgroundImage: `${
          isManager
            ? ""
            : "linear-gradient(to right, rgb(255,128,51) , rgb(94,59,140))"
        }`,
      }}
    />
  );
}

export default Nav;
