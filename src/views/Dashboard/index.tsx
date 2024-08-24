import "./index.css";
import { DashboardData, useDashboard } from "../../hooks/useDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function useLineChartOptions(minX: string) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: () => "",
          label: (tooltipItem: TooltipItem<"line">) => {
            const dashboardData = tooltipItem.raw as DashboardDataPoint

            return "Ngày: " + dashboardData.date
          },
          afterLabel: (tooltipItem: TooltipItem<"line">) => {
            const dashboardData = tooltipItem.raw as DashboardDataPoint

            return `Tổng doanh thu: ${new Intl.NumberFormat("vi-VN").format(
              dashboardData.totalRevenue
            )} VND`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
        min: minX,
      },
      y: {
        title: {
          display: true,
          text: "Tổng doanh thu (VND)",
        },
      },
    },
  };

  return options
}

function useLineChartData(dashboardData: DashboardData[] = []) {
  const chartData: ChartData<"line", DashboardDataPoint[]> = {
    labels: dashboardData.map(() => ""),
    datasets: [
      {
        label: "Tổng doanh thu",
        data:
          dashboardData.map((item) => ({
            date: item.date,
            totalRevenue: item.totalRevenue.totalRevenue,
          })),
        parsing: {
          xAxisKey: "date",
          yAxisKey: "totalRevenue",
        },
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  return chartData
}

type DashboardDataPoint = {
  date: string;
  totalRevenue: number;
};

function Dashboard() {
  const { data: dashboard } = useDashboard("day", 7);

  const dashboardData = dashboard?.data ?? []

  const options = useLineChartOptions(dashboardData[0]?.date ?? "")
  const chartData = useLineChartData(dashboardData)

  return (
    <div className="Dashboard">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
