import type { ChartData, ChartOptions } from "chart.js";
import type { DashboardData } from "../../hooks/useDashboard";
import { Bar } from "react-chartjs-2";

function useTotalOrderChartOptions() {
  const options: ChartOptions<"bar"> = {
    plugins: {
      tooltip: {

      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Ngày",
        },
      },
      y: {
        title: {
          display: true,
          text: "Số lượng",
        },
        stacked: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return options;
}

function useTotalOrderChartData(dashboardData: DashboardData[]) {
  const chartData: ChartData<'bar'> = {
    labels: dashboardData.map((it) => it.date),
    datasets: [
      {
        label: "Đơn hàng thành công",
        data: dashboardData.map((it) => it.totalOrders.completed),
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Đơn hàng hủy",
        data: dashboardData.map((it) => it.totalOrders.cancelled),
        backgroundColor: "rgb(192, 75, 192)",
        borderColor: "rgba(192, 75, 192, 0.2)",
      },
      {
        label: "Đơn hàng đang xử lý",
        data: dashboardData.map((it) => it.totalOrders.placed),
        backgroundColor: "rgb(192, 192, 75)",
        borderColor: "rgba(192, 192, 75, 0.2)",
      },
    ]
  };

  return chartData;
}

type TotalOrderChartProps = {
  dashboardData: DashboardData[];
};

export function TotalOrderChart(props: TotalOrderChartProps) {
  const { dashboardData } = props;

  const options = useTotalOrderChartOptions();
  const chartData = useTotalOrderChartData(dashboardData);

  return (
    <div className="TotalOrderChart">
      <Bar data={chartData as ChartData<'bar'>} options={options} />
    </div>
  );
}
