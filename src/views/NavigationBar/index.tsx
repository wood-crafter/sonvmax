import "./index.css";
import type { MenuProps } from "antd";
import { Input, Menu } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  DollarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useCategories } from "../../hooks/useCategories";
import { ACCOUTANT, AGENT, OWNER, SALES, STOCKER } from "../../constant";
import { AgentInfo, StaffInfo } from "../../type";
import { NumberToVND } from "../../helper";
import { useMeMutation } from "../../hooks/useMe";

type MenuItem = Required<MenuProps>["items"][number];

function isAgentInfo(user: AgentInfo | StaffInfo | null): user is AgentInfo {
  return (user as AgentInfo)?.agentName !== undefined;
}

const useManagerMenuItems = () => {
  const logout = useUserStore((state) => state.clear);
  const roleName = useUserStore((state) => state.roleName);

  const managerItems: MenuItem[] = [
    ...([OWNER.role, ACCOUTANT.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/dashboard">Thống kê</Link>,
            icon: <BarChartOutlined />,
            key: "dashboard",
          },
        ]
      : []),
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
    ...([OWNER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/voucher">Quản lý voucher</Link>,
            key: "voucher",
            icon: <PercentageOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, ACCOUTANT.role, SALES.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/orders">Quản lý đơn</Link>,
            key: "order",
            icon: <TruckOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, ACCOUTANT.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/products">Quản lý sản phẩm</Link>,
            key: "product",
            icon: <ProductOutlined />,
          },
        ]
      : []),
    ...([OWNER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/volumes">Quản lý đóng gói</Link>,
            key: "volumes",
            icon: <GiftOutlined />,
          },
        ]
      : []),
    ...([OWNER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/categories">Quản lý danh mục</Link>,
            key: "categories",
            icon: <DatabaseOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, ACCOUTANT.role, STOCKER.role].includes(roleName)
      ? [
          {
            label: (
              <Link to="/manage/invoice">
                {roleName === "STOCKER"
                  ? "Quản lý phiếu xuất kho"
                  : "Quản lý hóa đơn"}
              </Link>
            ),
            key: "invoice",
            icon: <FileTextOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, STOCKER.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/ticket">Quản lý xuất kho</Link>,
            key: "ticket",
            icon: <FileTextOutlined />,
          },
        ]
      : []),
    ...([OWNER.role, ACCOUTANT.role].includes(roleName)
      ? [
          {
            label: <Link to="/manage/transaction">Quản lý nạp tiền</Link>,
            key: "manage/transaction",
            icon: <DollarOutlined />,
          },
        ]
      : []),
    ...([OWNER.role].includes(roleName)
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

function AccountBalance() {
  const accessToken = useUserStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInformation);
  const setUserInformation = useUserStore((state) => state.setUserInformation);
  const { trigger: triggerMe } = useMeMutation();

  useEffect(() => {
    const triggerPersonalInfo = async () => {
      const me = await triggerMe();
      setUserInformation(me);
    };

    if (accessToken) {
      const intervalId = setInterval(triggerPersonalInfo, 2000);

      return () => clearInterval(intervalId);
    }
  }, [accessToken, setUserInformation, triggerMe]);

  const me = isAgentInfo(userInfo) ? userInfo : null;

  if (!me?.accountHave) {
    return null;
  }

  return <div>Số dư: {NumberToVND.format(+me?.accountHave)}</div>;
}

function Nav({ isManager = false }: { isManager: boolean }) {
  const navigate = useNavigate();
  const accessToken = useUserStore((state) => state.accessToken);
  const userInfo = useUserStore((state) => state.userInformation);
  const [current, setCurrent] = useState("mail");
  const roleName = useUserStore((state) => state.roleName);
  const setCategories = useUserStore((state) => state.setCategories);
  const { data: categoryResponse } = useCategories(1);
  const logout = useUserStore((state) => state.clear);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    if (categoryResponse) {
      setCategories(categoryResponse.data);
    }
  }, [categoryResponse, setCategories]);

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
      {
        label: (
          <Input
            placeholder="Tìm sản phẩm"
            style={{ color: "black" }}
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
            onPressEnter={() => {
              navigate(`/products?searchName=${searchName}`);
            }}
          />
        ),
        key: "searchProduct",
      },
      ...(accessToken
        ? [
            ...(!roleName || roleName === AGENT.role
              ? [
                  {
                    label: <Link to="/cart">Giỏ hàng</Link>,
                    key: "cart",
                    icon: <ShoppingCartOutlined />,
                  },
                ]
              : []),
            ...(!roleName || roleName === AGENT.role
              ? [
                  {
                    label: <Link to="/order/history">Lịch sử mua</Link>,
                    key: "orderHistory",
                    icon: <HistoryOutlined />,
                  },
                ]
              : []),
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
            ...(me && (!roleName || roleName === AGENT.role)
              ? [
                  {
                    label: <AccountBalance />,
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
                <div
                  onClick={() => {
                    logout();
                    // navigate("/");
                  }}
                >
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
  }, [accessToken, categoryResponse, logout, navigate, searchName, userInfo]);

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
