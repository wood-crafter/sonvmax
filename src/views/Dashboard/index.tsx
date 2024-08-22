/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.css";
import { useDashboard } from "../../hooks/useDashboard";
import { Line } from "@ant-design/charts";

function Dashboard() {
  const { data: dashboard } = useDashboard("day", 7);

  const chartData =
    dashboard?.data.map((item: any) => ({
      date: item.date,
      totalRevenue: item.totalRevenue?.totalRevenue || 0,
    })) || [];

  const config = {
    data: chartData,
    xField: "date",
    yField: "totalRevenue",
    smooth: true,
    xAxis: {
      title: {
        text: "Date",
      },
      tickCount: 7,
    },
    yAxis: {
      title: {
        text: "Total Revenue (VND)",
      },
      label: {
        formatter: (v: number) => new Intl.NumberFormat("vi-VN").format(v),
      },
    },
    label: {},
    point: {
      size: 5,
      shape: "diamond",
    },
    tooltip: {
      title: () => {
        return "Tổng doanh thu";
      },
    },
  };

  return (
    <div className="Dashboard">
      <div className="chart-container">
        <Line {...config} />
      </div>
      <div className="chart-container">
        <Line {...config} />
      </div>
      <div className="chart-container">
        <Line {...config} />
      </div>
      <div className="chart-container">
        <Line {...config} />
      </div>
      <div className="chart-container">
        <Line {...config} />
      </div>
    </div>
  );
}

export default Dashboard;
