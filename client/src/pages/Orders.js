import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/api';
import "./Orders.css"
const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetchOrders();
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="orders">
      <h2>Orders</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Order ID</th>
      <th>Value (₹)</th>
      <th>Route ID</th>
      <th>Delivery Time</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.order_id}</td>
        <td>{order.value_rs}</td>
        <td>{order.route_id}</td>
        <td>{order.delivery_time}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default Orders;
