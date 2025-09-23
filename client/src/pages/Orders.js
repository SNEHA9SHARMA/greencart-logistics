import React, { useEffect, useState } from 'react';
import { fetchOrders,addOrder, updateOrder, deleteOrder } from '../api/api';
import "./Orders.css"

//======================CREATE=====================================
const CreateOrders = () => {
  const [form, setForm] = useState({
    value_rs: "",
    route_id: "",
    delivery_time: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addOrder(form);
      alert("Order added successfully!");
      setForm({ value_rs: "", route_id: "", delivery_time: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="managePage">
      <h3>Add Order</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="value_rs"
          placeholder="Value (Rs)"
          value={form.value_rs}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="route_id"
          placeholder="Route ID"
          value={form.route_id}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="delivery_time"
          value={form.delivery_time}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
};


//==============================READ============================
const ReadOrders = () => {
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
    <div className="managePage" >
      <h3>Orders</h3>
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
//==========================UPDATE=============================
const UpdateOrders = () => {
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    value_rs: "",
    route_id: "",
    delivery_time: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(id, form);
      alert("Order updated successfully!");
      setId("");
      setForm({ value_rs: "", route_id: "", delivery_time: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="managePage">
      <h3>Update Order</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Order ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="number"
          name="value_rs"
          placeholder="Value (Rs)"
          value={form.value_rs}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="route_id"
          placeholder="Route ID"
          value={form.route_id}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="delivery_time"
          value={form.delivery_time}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

//====================================DELETE========================================
const DeleteOrders = () => {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    try {
      await deleteOrder(id);
      alert("Order deleted successfully!");
      setId("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="managePage">
      <h3>Delete Order</h3>
      <input
        type="number"
        placeholder="Order ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Order</button>
    </div>
  );
};

//============================MAIN============================================
const OrdersManagement = () => {
  const [active, setActive] = useState("menu"); // "menu" means buttons are visible

  const renderContent = () => {
    switch (active) {
      case "view":
        return <ReadOrders />;
      case "add":
        return <CreateOrders />;
      case "update":
        return <UpdateOrders />;
      case "delete":
        return <DeleteOrders />;
      default:
        return null;
    }
  };

  return (
    <div className="Management">
      <h2>Manage Orders</h2>

      {/* Show menu if active = menu */}
      {active === "menu" && (
        <div className="button-group">
          <button onClick={() => setActive("view")}>View</button>
          <button onClick={() => setActive("add")}>Add</button>
          <button onClick={() => setActive("update")}>Update</button>
          <button onClick={() => setActive("delete")}>Remove</button>
        </div>
      )}

      {/* Show selected component with a Back button */}
      {active !== "menu" && (
        <div>
          {renderContent()}
          <button
            style={{ marginTop: "1rem" }}
            onClick={() => setActive("menu")}
          >
            ⬅ Back
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;


