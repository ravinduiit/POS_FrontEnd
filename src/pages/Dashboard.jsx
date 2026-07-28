import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import StatCard from "../components/dashboard/StatCard";

// import "../styles/dashboard.css";

function Dashboard() {
  const [summary] = useState({
    todaySales: 4200,
    todayRevenue: 125450,
    todayProfit: 31250,
    totalDue: 18600,
  });

  const [chartData] = useState([
    {
      day: "Mon",
      revenue: 18000,
      profit: 5200,
    },
    {
      day: "Tue",
      revenue: 21000,
      profit: 6400,
    },
    {
      day: "Wed",
      revenue: 19500,
      profit: 5700,
    },
    {
      day: "Thu",
      revenue: 25000,
      profit: 8100,
    },
    {
      day: "Fri",
      revenue: 28000,
      profit: 9300,
    },
    {
      day: "Sat",
      revenue: 32000,
      profit: 10800,
    },
    {
      day: "Sun",
      revenue: 27000,
      profit: 8500,
    },
  ]);

  const [paymentData] = useState([
    {
      name: "Cash",
      value: 68,
    },
    {
      name: "Card",
      value: 32,
    },
  ]);

  const [lowStock] = useState([
    {
      product: "Anchor Milk Powder",
      stock: 4,
      reorder: 15,
    },
    {
      product: "Sugar",
      stock: 5,
      reorder: 20,
    },
    {
      product: "Rice 5Kg",
      stock: 8,
      reorder: 25,
    },
    {
      product: "Soap",
      stock: 2,
      reorder: 10,
    },
    {
      product: "Sunlight",
      stock: 1,
      reorder: 8,
    },
  ]);

  const [recentSales] = useState([
    {
      invoice: 10021,
      customer: "Walk In",
      payment: "Cash",
      total: 2500,
      time: "09:25",
    },
    {
      invoice: 10022,
      customer: "Kasun",
      payment: "Card",
      total: 3500,
      time: "10:10",
    },
    {
      invoice: 10023,
      customer: "Nimal",
      payment: "Cash",
      total: 1800,
      time: "10:45",
    },
    {
      invoice: 10024,
      customer: "Walk In",
      payment: "Cash",
      total: 4200,
      time: "11:15",
    },
    {
      invoice: 10025,
      customer: "Saman",
      payment: "Card",
      total: 980,
      time: "12:05",
    },
  ]);

  return (
    <MainLayout>
      
      {/* Summary Cards */}
        <div className="row g-3 dashboard-summary">

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Today's Sales"
              value={summary.todaySales}
              icon="bi bi-receipt"
              color="primary"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Today's Revenue"
              value={`Rs. ${summary.todayRevenue.toLocaleString()}`}
              icon="bi bi-cash-stack"
              color="success"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Today's Profit"
              value={`Rs. ${summary.todayProfit.toLocaleString()}`}
              icon="bi bi-graph-up-arrow"
              color="warning"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Total Due"
              value={`Rs. ${summary.totalDue.toLocaleString()}`}
              icon="bi bi-credit-card"
              color="danger"
            />
          </div>

        </div>
      {/* Charts */}


    </MainLayout>
  );
}

export default Dashboard;