import { Bar } from "react-chartjs-2";
import type { DashboardData } from "../../hooks/useDashboard";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { NumberToVND } from "../../helper";

function useTopSellingProductChartOptions(dashboardData: DashboardData[]) {
  const options: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: () => "",
          label: (tooltipItem: TooltipItem<"bar">) => {
            const { topSellingProducts } = dashboardData[tooltipItem.dataIndex]

            return `Sản phẩm: ${topSellingProducts[0].productName}`
          },
          afterLabel: (tooltipItem: TooltipItem<"bar">) => {
            const { topSellingProducts } = dashboardData[tooltipItem.dataIndex]

            return [
              `Số lượng: ${topSellingProducts[0].totalSold}`,
              `Doanh thu: ${NumberToVND.format(topSellingProducts[0].totalRevenue)} VND`,
            ]
          }
        },
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        }
      },
      y: {
        title: {
          display: true,
          text: "Số lượng",
        },
        ticks: {
          stepSize: 1,
        }
      }
    }
  }

  return options
}

function useTopSellingProductChartData(dashboardData: DashboardData[]) {
  const chartData: ChartData<'bar'> = {
    labels: dashboardData.map((it) => it.date),
    datasets: [
      {
        label: 'Sản phẩm bán chạy nhất',
        data: dashboardData.map((item) => item.topSellingProducts[0].totalSold),
      }
    ],
  }

  return chartData
}

type TopSellingProductChartProps = {
  dashboardData: DashboardData[];
}

export function TopSellingProductChart(props: TopSellingProductChartProps) {
  const { dashboardData } = props

  const options = useTopSellingProductChartOptions(dashboardData)
  const chartData = useTopSellingProductChartData(dashboardData)

  return (
    <div className="TopSellingProductChart">
      <Bar data={chartData} options={options} />
    </div>
  );
}