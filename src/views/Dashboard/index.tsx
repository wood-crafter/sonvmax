import "./index.css";
import { DashboardData, useDashboard } from "../../hooks/useDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { DownOutlined } from "@ant-design/icons";
import { RevenueChart } from "./RevenueChart";
import { TopSellingProductChart } from "./TopSellingProductChart";
import { Button, Dropdown, Menu, Spin, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import { TotalOrderChart } from "./TotalOrderChart";
import { AverageOrderValueChart } from "./AverageOrderValueChart";
import { TotalProductSoldChart } from "./TotalProductSoldChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth;
}

const useDashboardTabs = (dashboardData: DashboardData[]) => {
  const tabs = useMemo(() => {
    return [
      {
        label: "Tổng doanh thu",
        key: "1",
        children: <RevenueChart dashboardData={dashboardData} />,
      },
      {
        label: "Sản phẩm bán chạy",
        key: "2",
        children: <TopSellingProductChart dashboardData={dashboardData} />,
      },
      {
        label: "Tổng đơn hàng",
        key: "3",
        children: <TotalOrderChart dashboardData={dashboardData} />,
      },
      {
        label: "Giá trị đơn hàng trung bình",
        key: "4",
        children: <AverageOrderValueChart dashboardData={dashboardData} />,
      },
      {
        label: "Tổng số sản phẩm bán ra",
        key: "5",
        children: <TotalProductSoldChart dashboardData={dashboardData} />,
      },
    ];
  }, [dashboardData]);

  return tabs;
};

type SortByItem = {
  label: string;
  key: string;
};

const sortBy: SortByItem[] = [
  { label: "Ngày", key: "0" },
  { label: "Tháng", key: "1" },
  { label: "Quý", key: "2" },
];

function Dashboard() {
  const [selectedSortKey, setSelectedSortKey] = useState("0");
  const [selectedPeriodKey, setSelectedPeriodKey] = useState("0");

  const {
    data: dashboard,
    isLoading,
    error,
    mutate,
  } = useDashboard(
    mapSortKeyToSortBy(selectedSortKey),
    mapPeriodKeyToPeriod(selectedPeriodKey, selectedSortKey)
  );

  const windowWidth = useWindowWidth();

  const handleSortMenuClick = ({ key }: { key: string }) => {
    setSelectedSortKey(key);
    setSelectedPeriodKey("0");
  };

  const handlePeriodMenuClick = ({ key }: { key: string }) => {
    setSelectedPeriodKey(key);
  };

  useEffect(() => {
    mutate();
  }, [selectedSortKey, selectedPeriodKey, mutate]);

  const getPeriodMenuItems = () => {
    switch (selectedSortKey) {
      case "0":
        return [
          { label: "7 ngày", key: "0" },
          { label: "14 ngày", key: "1" },
          { label: "21 ngày", key: "2" },
        ];
      case "1":
        return [
          { label: "3 tháng", key: "0" },
          { label: "6 tháng", key: "1" },
          { label: "9 tháng", key: "2" },
        ];
      case "2":
        return [
          { label: "4 Quý", key: "0" },
          { label: "8 Quý", key: "1" },
          { label: "12 Quý", key: "2" },
        ];
      default:
        return [];
    }
  };

  const tabs = useDashboardTabs(dashboard?.data ?? []);

  const sortMenu = (
    <Menu onClick={handleSortMenuClick}>
      {sortBy.map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  const periodMenu = (
    <Menu onClick={handlePeriodMenuClick}>
      {getPeriodMenuItems().map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  if (error) return <div>Error loading dashboard data</div>;

  return (
    <div
      className="Dashboard"
      key={windowWidth} // Trigger re-render on window resize
    >
      <div className="chart-container">
        <Dropdown overlay={sortMenu} trigger={["click"]}>
          <Button>
            Sắp xếp theo:{" "}
            {sortBy.find((item) => item.key === selectedSortKey)?.label}
            <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown overlay={periodMenu} trigger={["click"]}>
          <Button style={{ marginLeft: "1rem" }}>
            Giai đoạn:{" "}
            {
              getPeriodMenuItems().find(
                (item) => item.key === selectedPeriodKey
              )?.label
            }
            <DownOutlined />
          </Button>
        </Dropdown>
        <Tabs defaultActiveKey="1" items={tabs} />
      </div>
    </div>
  );
}

function mapSortKeyToSortBy(key: string): string {
  switch (key) {
    case "0":
      return "day";
    case "1":
      return "month";
    case "2":
      return "quarter";
    default:
      return "day";
  }
}

function mapPeriodKeyToPeriod(periodKey: string, sortKey: string): number {
  const dayPeriods = [7, 14, 21];
  const monthPeriods = [3, 6, 9];
  const quarterPeriods = [4, 8, 12];

  switch (sortKey) {
    case "0":
      return dayPeriods[parseInt(periodKey)] || 7;
    case "1":
      return monthPeriods[parseInt(periodKey)] || 3;
    case "2":
      return quarterPeriods[parseInt(periodKey)] || 4;
    default:
      return 7;
  }
}

export default Dashboard;
