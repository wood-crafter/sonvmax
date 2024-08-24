import "./index.css";
import { useDashboard } from "../../hooks/useDashboard";
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
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { TotalOrderChart } from "./TotalOrderChart";
import { ChartDivider } from "./ChartDivider/ChartDivider";

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

function Dashboard() {
  const { data: dashboard, isLoading } = useDashboard("day", 7);
  const windowWidth = useWindowWidth();

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

  const dashboardData = dashboard?.data ?? [];

  return (
    <div
      className="Dashboard"
      // ? workaround to re-render the chart when the window is resized
      key={windowWidth}
    >
      <div className="chart-container">
        <ChartDivider>Tổng doanh thu</ChartDivider>
        <RevenueChart dashboardData={dashboardData} />
        <ChartDivider>Sản phẩm bán chạy nhất</ChartDivider>
        <TopSellingProductChart dashboardData={dashboardData} />
        <ChartDivider>Số lượng đơn hàng</ChartDivider>
        <TotalOrderChart dashboardData={dashboardData} />
      </div>
    </div>
  );
}

export default Dashboard;
