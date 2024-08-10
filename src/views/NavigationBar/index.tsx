import "./index.css";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState } from "react";
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
  GiftOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useCategories } from "../../hooks/useCategories";
import { OWNER, STOCKER } from "../../constant";

type MenuItem = Required<MenuProps>["items"][number];

const useManagerMenuItems = () => {
  const logout = useUserStore((state) => state.clear);
  const roleName = useUserStore((state) => state.roleName);

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
    ...[OWNER.role].includes(roleName) ? [
      {
        label: <Link to="/manage/roles">Quản lý roles</Link>,
        key: "roles",
        icon: <ClusterOutlined />,
      }
    ] : []
    ,
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
      label: <Link to="/manage/volumes">Quản lý đóng gói</Link>,
      key: "volumes",
      icon: <GiftOutlined />,
    },
    {
      label: <Link to="/manage/categories">Quản lý danh mục</Link>,
      key: "categories",
      icon: <DatabaseOutlined />,
    },
    {
      label: "Quản lý hóa đơn",
      key: "invoice",
    },
    {
      label: <Link to="/manage/color">Quản lý màu</Link>,
      key: "color",
      icon: <FormatPainterOutlined />,
    }, {
      label: <div onClick={logout}>Đăng xuất</div>,
      key: "logout",
    }
  ];

  return managerItems;
}

const useClientMenuItems = (accessToken: string) => {
  const { data: categoryResponse } = useCategories(1);
  const logout = useUserStore((state) => state.clear);

  const clientItems: MenuItem[] = [
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
    ...(accessToken ? [
      {
        label: <Link to="/cart">Giỏ hàng</Link>,
        key: "cart",
        icon: <ShoppingCartOutlined />,
      }, {
        label: <Link to="/order/history">Lịch sử mua</Link>,
        key: "orderHistory",
        icon: <HistoryOutlined />,
      }, {
        label: <Link to="/profile">Hồ sơ</Link>,
        key: "profile",
        icon: <ProfileOutlined />,
      }, {
        label: <div onClick={logout}>Đăng xuất</div>,
        key: "logout",
      }
    ] : [{
      label: <Link to="/login">Đăng nhập</Link>,
      key: "login",
    }])
  ];

  return clientItems;
}

function Nav({ isManager = false }: { isManager: boolean }) {
  const accessToken = useUserStore((state) => state.accessToken);
  const [current, setCurrent] = useState("mail");

  const managerMenuItems = useManagerMenuItems();
  const clientMenuItems = useClientMenuItems(accessToken);

  return (
    <Menu
      className={`${isManager ? "" : "home-menubar"}`}
      onClick={e => setCurrent(e.key)}
      selectedKeys={[current]}
      mode={isManager ? "vertical" : "horizontal"}
      items={
        isManager
          ? managerMenuItems
          : clientMenuItems
      }
      style={{
        backgroundImage: `${isManager
          ? ""
          : "linear-gradient(to right, rgb(255,128,51) , rgb(94,59,140))"
          }`,
      }}
    />
  );
}

export default Nav;
