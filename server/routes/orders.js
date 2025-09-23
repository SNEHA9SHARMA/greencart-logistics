import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows); // Must send an array, not undefined
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});
router.post("/add", async (req, res) => {
  try {
    const { value_rs, route_id, delivery_time } = req.body;
    if (!value_rs || !route_id || !delivery_time) {
      return res
        .status(400)
        .json({ error: "Value, Route ID and Delivery time are required" });
    }

    // Get the next order_id manually
    const lastIdResult = await pool.query(
      "SELECT COALESCE(MAX(order_id), 0) + 1 AS next_id FROM drivers"
    );
    const nextId = lastIdResult.rows[0].next_id;

    const result = await pool.query(
      `INSERT INTO drivers (order_id, value_rs, route_id, delivery_time) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nextId, value_rs, route_id, delivery_time]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // order_id to update
    const { value_rs, route_id, delivery_time } = req.body;

    // Validate input
    if (!value_rs || !route_id || !delivery_time) {
      return res
        .status(400)
        .json({ error: "Value, Route ID and Delivery time are required" });
    }

    // Update the row
    const result = await pool.query(
      `UPDATE drivers 
       SET value_rs = $1, route_id = $2, delivery_time = $3
       WHERE order_id = $4
       RETURNING *`,
      [value_rs, route_id, delivery_time, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // order_id to delete

    const result = await pool.query(
      `DELETE FROM drivers WHERE order_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

