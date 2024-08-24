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
import { RevenueChart } from "./RevenueChart";
import { TopSellingProductChart } from "./TopSellingProductChart";
import { Spin, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import { TotalOrderChart } from "./TotalOrderChart";
import { AverageOrderValueChart } from "./AverageOrderValueChart";

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
        label: 'Tổng doanh thu',
        key: '1',
        children: <RevenueChart dashboardData={dashboardData} />
      },
      {
        label: 'Sản phẩm bán chạy',
        key: '2',
        children: <TopSellingProductChart dashboardData={dashboardData} />
      },
      {
        label: 'Tổng đơn hàng',
        key: '3',
        children: <TotalOrderChart dashboardData={dashboardData} />
      },
      {
        label: 'Giá trị đơn hàng trung bình',
        key: '4',
        children: <AverageOrderValueChart dashboardData={dashboardData} />,
      }
    ]
  }, [dashboardData]);

  return tabs;
}

function Dashboard() {
  const { data: dashboard, isLoading } = useDashboard("day", 7);
  const windowWidth = useWindowWidth();

  const tabs = useDashboardTabs(dashboard?.data ?? [])

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

  return (
    <div
      className="Dashboard"
      // ? workaround to re-render the chart when the window is resized
      key={windowWidth}
    >
      <div className="chart-container">
        <Tabs
          defaultActiveKey="4"
          items={tabs}
        />
      </div>
    </div>
  );
}

export default Dashboard;
