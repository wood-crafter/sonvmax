import "./index.css";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useEffect, useMemo, useState } from "react";
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
  LockOutlined,
  FileTextOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useCategories } from "../../hooks/useCategories";
import { ACCOUTANT, OWNER, SALES, STOCKER } from "../../constant";
import { AgentInfo, StaffInfo } from "../../type";
import { NumberToVND } from "../../helper";

type MenuItem = Required<MenuProps>["items"][number];

function isAgentInfo(user: AgentInfo | StaffInfo | null): user is AgentInfo {
  return (user as AgentInfo)?.agentName !== undefined;
}

const useManagerMenuItems = () => {
  const logout = useUserStore((state) => state.clear);
  const roleName = useUserStore((state) => state.roleName);

  const managerItems: MenuItem[] = [
    ...([OWNER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/staff">Quản lý nhân viên</Link>,
            key: "staff",
            icon: <TeamOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, ACCOUTANT.role, SALES.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/agents">Quản lý đại lý</Link>,
            key: "agent",
            icon: <CustomerServiceOutlined />,
          },
        ]
      : []),
    ...([OWNER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/roles">Quản lý chức vụ</Link>,
            key: "roles",
            icon: <ClusterOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, ACCOUTANT.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/voucher">Quản lý voucher</Link>,
            key: "voucher",
            icon: <PercentageOutlined />,
          },
        ]
      : []),
    ...([STOCKER.role, ACCOUTANT.role, SALES.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/orders">Quản lý đơn</Link>,
            key: "order",
            icon: <TruckOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, STOCKER.role, ACCOUTANT.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/products">Quản lý sản phẩm</Link>,
            key: "product",
            icon: <ProductOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, STOCKER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/volumes">Quản lý đóng gói</Link>,
            key: "volumes",
            icon: <GiftOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, STOCKER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/categories">Quản lý danh mục</Link>,
            key: "categories",
            icon: <DatabaseOutlined />,
          },
        ]
      : []),
    ...([ACCOUTANT.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/invoice">Quản lý hóa đơn</Link>,
            key: "invoice",
            icon: <FileTextOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, STOCKER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/color">Quản lý màu</Link>,
            key: "color",
            icon: <FormatPainterOutlined />,
          },
        ]
      : []),
    {
      label: <Link to="/manage/change_password">Đổi mật khẩu</Link>,
      key: "change_password",
      icon: <LockOutlined />,
    },
    {
      label: <Link to="/manage/profile">Hồ sơ</Link>,
      key: "manage/profile",
      icon: <ProfileOutlined />,
    },
    {
      label: <div onClick={logout}>Đăng xuất</div>,
      key: "logout",
    },
  ];

  return managerItems;
};

function Nav({ isManager = false }: { isManager: boolean }) {
  const accessToken = useUserStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInformation);
  const [current, setCurrent] = useState("mail");
  const setCategories = useUserStore((state) => state.setCategories);
  const { data: categoryResponse } = useCategories(1);
  const logout = useUserStore((state) => state.clear);

  useEffect(() => {
    if (categoryResponse) {
      setCategories(categoryResponse.data);
    }
  }, [categoryResponse]);

  const managerMenuItems = useManagerMenuItems();
  const clientMenuItems = useMemo(() => {
    const me = isAgentInfo(userInfo) ? userInfo : null;
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
      ...(accessToken
        ? [
            {
              label: <Link to="/cart">Giỏ hàng</Link>,
              key: "cart",
              icon: <ShoppingCartOutlined />,
            },
            {
              label: <Link to="/order/history">Lịch sử mua</Link>,
              key: "orderHistory",
              icon: <HistoryOutlined />,
            },
            {
              label: <Link to="/profile">Hồ sơ</Link>,
              key: "profile",
              icon: <ProfileOutlined />,
            },
            {
              label: <Link to="/change_password">Đổi mật khẩu</Link>,
              key: "change_password",
              icon: <LockOutlined />,
            },
            ...(me
              ? [
                  {
                    label: (
                      <div>Số dư: {NumberToVND.format(+me?.accountHave)}</div>
                    ),
                    key: "transaction",
                    children: [
                      {
                        label: <Link to="/transaction">Nạp tiền</Link>,
                        key: "transaction",
                      },
                      {
                        label: (
                          <Link to="/transaction_history">
                            Lịch sử nạp tiền
                          </Link>
                        ),
                        key: "transaction_history",
                      },
                    ],
                  },
                ]
              : []),
            {
              label: (
                <div onClick={logout}>
                  <LogoutOutlined style={{ marginRight: "0.5rem" }} />
                  Đăng xuất
                </div>
              ),
              key: "logout",
            },
          ]
        : [
            {
              label: (
                <Link to="/login">
                  <LoginOutlined style={{ marginRight: "0.5rem" }} />
                  Đăng nhập
                </Link>
              ),
              key: "login",
            },
          ]),
    ];

    return clientItems;
  }, [accessToken, userInfo]);

  return (
    <Menu
      className={`${isManager ? "" : "home-menubar"}`}
      onClick={(e) => setCurrent(e.key)}
      selectedKeys={[current]}
      mode={isManager ? "vertical" : "horizontal"}
      items={isManager ? managerMenuItems : clientMenuItems}
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
