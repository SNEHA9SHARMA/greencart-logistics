import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./Dashboard.css";
const Dashboard = ({ token }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/dashboard/latest", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      }
    };
    fetchDashboard();
  }, [token]);

  if (!data) return <div>Loading dashboard...</div>;

  
  let fuelData = [];
  try {
    const base = parseFloat(data.fuel_cost_base) || 0;
    const surcharge = parseFloat(data.fuel_cost_surcharge) || 0;

    fuelData = [
      { name: "Base Fuel Cost", value: base },
      { name: "Traffic Surcharge", value: surcharge }
    ];

    console.log("Fuel Data:", fuelData); 
  } catch (err) {
    console.error("Error preparing fuel data:", err);
  }

  const deliveryData = [
    { name: "On Time", value: data.on_time_deliveries || 0 },
    { name: "Late", value: data.late_deliveries || 0 }
  ];

  const COLORS = ["#4caf50", "#f44336"];
  const FUEL_COLORS = ["#2196f3", "#ff9800"];

  return (
    <div className="dashboard" style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <div>Total Profit: ₹{data.total_profit}</div>
      <div>Efficiency: {data.efficiency}%</div>
      <div>On-time Deliveries: {data.on_time_deliveries}</div>
      <div>Late Deliveries: {data.late_deliveries}</div>

      <h3>Delivery Status</h3>
      <PieChart width={300} height={300}>
        <Pie data={deliveryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
          {deliveryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h3>Fuel Cost Breakdown</h3>
      {fuelData[0].value === 0 && fuelData[1].value === 0 ? (
        <div>No fuel cost data available</div>
      ) : (
        <PieChart width={300} height={300}>
          <Pie data={fuelData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
            {fuelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={FUEL_COLORS[index % FUEL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
};

export default Dashboard;


