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

function Dashboard() {
  const { data: dashboard, isLoading } = useDashboard("day", 7);
  // ? workaround to re-render the chart when the window is resized
  const [dashboardContainerKey, setDashboardContainerKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDashboardContainerKey((prev) => prev + 1);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

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
    <div className="Dashboard" key={dashboardContainerKey}>
      <div className="chart-container">
        <RevenueChart dashboardData={dashboardData} />
        <TopSellingProductChart dashboardData={dashboardData} />
      </div>
    </div>
  );
}

export default Dashboard;
