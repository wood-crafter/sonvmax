import { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { DashboardData } from "../../hooks/useDashboard";
import { Line } from "react-chartjs-2";

function useAverageOrderValueChartOptions(dashboardData: DashboardData[]) {
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
            const { averageOrderValue } = dashboardData[tooltipItem.dataIndex];

            return "Ngày: " + averageOrderValue.date;
          },
          afterLabel: (tooltipItem: TooltipItem<"line">) => {
            const { averageOrderValue } = dashboardData[tooltipItem.dataIndex];

            return `Tổng doanh thu: ${new Intl.NumberFormat("vi-VN").format(
              averageOrderValue.averageOrderValue
            )} VND`;
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
        min: dashboardData[0]?.date,
      },
      y: {
        title: {
          display: true,
          text: "Tổng doanh thu (VND)",
        },
        min: 0,
      },
    },
  };

  return options;
}

function useAverageOrderValueChartData(dashboardData: DashboardData[] = []) {
  const chartData: ChartData<"line"> = {
    labels: dashboardData.map((it) => it.date),
    datasets: [
      {
        label: "Giá trị đơn hàng trung bình",
        data: dashboardData.map(
          (item) => item.averageOrderValue.averageOrderValue
        ),
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

  return chartData;
}

type AverageOrderValueChartProps = {
  dashboardData: DashboardData[];
};

export function AverageOrderValueChart({
  dashboardData,
}: AverageOrderValueChartProps) {
  const chartData = useAverageOrderValueChartData(dashboardData);
  const options = useAverageOrderValueChartOptions(dashboardData);

  return (
    <div className="AverageOrderValueChart">
      <Line data={chartData} options={options} />
    </div>
  );
}
