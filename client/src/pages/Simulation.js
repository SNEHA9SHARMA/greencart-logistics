import React, { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Simulation.css";
const Simulation = () => {
  const [numDrivers, setNumDrivers] = useState(5);
  const [routeStartTime, setRouteStartTime] = useState("09:00");
  const [maxHours, setMaxHours] = useState(8);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runSimulation = async () => {
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/simulation`, {
        numDrivers,
        routeStartTime,
        maxHoursPerDriver: maxHours
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Simulation failed");
    }
  };

  return (
    <div className="simulation" style={{ padding: 20 }}>
      <h2>Delivery Simulation</h2>

      <div>
        <label>Number of Drivers: </label>
        <input type="number" value={numDrivers} onChange={e => setNumDrivers(+e.target.value)} />
      </div>
      <div>
        <label>Route Start Time (HH:MM): </label>
        <input type="text" value={routeStartTime} onChange={e => setRouteStartTime(e.target.value)} />
      </div>
      <div>
        <label>Max Hours per Driver: </label>
        <input type="number" value={maxHours} onChange={e => setMaxHours(+e.target.value)} />
      </div>
      <button onClick={runSimulation}>Run Simulation</button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div className="simulation-container" style={{ marginTop: 20 }}>
          <h3>Simulation Results</h3>
          <div>Total Profit: ₹{result.totalProfit}</div>
          <div>Efficiency: {result.efficiency}%</div>
          <div>On-time Deliveries: {result.onTimeDeliveries}</div>
          <div>Late Deliveries: {result.lateDeliveries}</div>

          <h3>Delivery Status Chart</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={[
                { name: "On Time", value: result.onTimeDeliveries },
                { name: "Late", value: result.lateDeliveries }
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              <Cell fill="#4caf50" />
              <Cell fill="#f44336" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h3>Fuel Cost Breakdown</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={[
                { name: "Base Fuel", value: result.fuelCostBase },
                { name: "High Traffic Surcharge", value: result.fuelCostSurcharge }
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              <Cell fill="#2196f3" />
              <Cell fill="#ff9800" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h3>Driver Allocations</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Total Hours</th>
                <th>Orders Assigned</th>
              </tr>
            </thead>
            <tbody>
              {result.drivers.map(driver => (
                <tr key={driver.id}>
                  <td>{driver.id}</td>
                  <td>{driver.totalHours.toFixed(2)}</td>
                  <td>
                    {driver.orders.map(o => (
                      <div key={o.id}>Order {o.id} | Profit: ₹{o.profit.toFixed(2)}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Simulation;
