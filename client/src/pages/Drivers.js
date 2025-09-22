import React, { useEffect, useState } from 'react';
import { fetchDrivers } from '../api/api';
import "./Drivers.css"
const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const res = await fetchDrivers();
        console.log(res.data);
        setDrivers(Array.isArray(res.data) ? res.data : res.data.drivers || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setDrivers([]);
      }
    };

    getDrivers();
  }, []);

  return (
    <div className="drivers">
      <h2>Drivers</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Shift Hours</th>
      <th>Past Week Hours</th>
    </tr>
  </thead>
  <tbody>
    {drivers.map((driver) => (
      <tr key={driver.id}>
        <td>{driver.id}</td>
        <td>{driver.name}</td>
        <td>{driver.shift_hours}</td>
        <td>{driver.past_week_hours}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Drivers;
