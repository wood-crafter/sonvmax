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
  Legend
);

function Dashboard() {
  const { data: dashboard } = useDashboard("day", 7);

  const chartData: ChartData<"line"> = {
    labels: dashboard?.data.map(() => "") || [],
    datasets: [
      {
        label: "Tổng doanh thu",
        data:
          dashboard?.data.map((item) => {
            return {
              x: item.totalRevenue.date,
              y: item.totalRevenue?.totalRevenue || 0,
            };
          }) || [],
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

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"line">) => {
            return [
              `Tổng doanh thu: ${new Intl.NumberFormat("vi-VN").format(
                tooltipItem.parsed.y
              )} VND`,
              "Ngày: " + dashboard?.data?.[tooltipItem.dataIndex].date,
            ];
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
      },
      y: {
        title: {
          display: true,
          text: "Tổng doanh thu (VND)",
        },
      },
    },
  };

  return (
    <div className="Dashboard">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
