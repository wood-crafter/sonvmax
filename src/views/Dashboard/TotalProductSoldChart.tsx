import { Line } from "react-chartjs-2";
import { DashboardData } from "../../hooks/useDashboard";
import { ChartData, ChartOptions, TooltipItem } from "chart.js";

function useTotalProductSoldChartOptions(dashboardData: DashboardData[]) {
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
            const { totalProductsSold } = dashboardData[tooltipItem.dataIndex];

            return "Ngày: " + totalProductsSold.date;
          },
          afterLabel: (tooltipItem: TooltipItem<"line">) => {
            const { totalProductsSold } = dashboardData[tooltipItem.dataIndex];

            return `Số sản phẩm: ${totalProductsSold.totalProductsSold}`;
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
          text: "Số sản phẩm",
        },
        min: 0,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return options;
}

function useTotalProductSoldChartData(dashboardData: DashboardData[] = []) {
  const chartData: ChartData<"line"> = {
    labels: dashboardData.map((it) => it.date),
    datasets: [
      {
        label: "Tổng số sản phẩm bán ra",
        data: dashboardData.map(
          (item) => item.totalProductsSold.totalProductsSold
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

type TotalProductSoldChartProps = {
  dashboardData: DashboardData[];
};

export function TotalProductSoldChart({
  dashboardData,
}: TotalProductSoldChartProps) {
  const chartData = useTotalProductSoldChartData(dashboardData);
  const options = useTotalProductSoldChartOptions(dashboardData);

  return (
    <div className="TotalProductSoldChart">
      <Line data={chartData} options={options} />
    </div>
  );
}
