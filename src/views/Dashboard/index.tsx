import "./index.css";
import { useDashboard } from "../../hooks/useDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { RevenueChart } from "./RevenueChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function Dashboard() {
  const { data: dashboard } = useDashboard("day", 7);

  const dashboardData = dashboard?.data ?? []

  return (
    <div className="Dashboard">
      <div className="chart-container">
        <RevenueChart dashboardData={dashboardData} />
      </div>
    </div>
  );
}

export default Dashboard;
