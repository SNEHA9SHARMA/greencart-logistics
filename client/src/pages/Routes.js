import React, { useEffect, useState } from 'react';
import { fetchRoutes } from '../api/api';
import "./Routes.css";
const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const getRoutes = async () => {
      try {
        const res = await fetchRoutes();
        // Ensure routes is always an array
        setRoutes(Array.isArray(res.data) ? res.data : res.data.routes || []);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setRoutes([]);
      }
    };

    getRoutes();
  }, []);

  return (
    <div className="routes">
      <h2>Routes</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Route ID</th>
      <th>Distance (km)</th>
      <th>Traffic Level</th>
      <th>Base Time (min)</th>
    </tr>
  </thead>
  <tbody>
    {routes.map((route) => (
      <tr key={route.id}>
        <td>{route.id}</td>
        <td>{route.route_id}</td>
        <td>{route.distance_km}</td>
        <td>{route.traffic_level}</td>
        <td>{route.base_time_min}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default RoutesPage;
