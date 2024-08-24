import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import type { DashboardData } from "../../hooks/useDashboard";
import { Line } from "react-chartjs-2";


function useRevenueChartOptions(minX: string) {
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
            const dashboardData = tooltipItem.raw as RevenueChartDataPoint

            return "Ngày: " + dashboardData.date
          },
          afterLabel: (tooltipItem: TooltipItem<"line">) => {
            const dashboardData = tooltipItem.raw as RevenueChartDataPoint

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

function useRevenueChartData(dashboardData: DashboardData[] = []) {
  const chartData: ChartData<"line", RevenueChartDataPoint[]> = {
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

type RevenueChartDataPoint = {
  date: string;
  totalRevenue: number;
};

type RevenueChartProps = {
  dashboardData: DashboardData[];
}

export function RevenueChart(props: RevenueChartProps) {
  const { dashboardData } = props

  const options = useRevenueChartOptions(dashboardData[0]?.date ?? "")
  const chartData = useRevenueChartData(dashboardData)

  return (
    <div className="RevenueChart">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}