import express from "express";
import pool from "../db.js"; // your PostgreSQL pool connection

const infoRouter = express.Router();

// GET all drivers
infoRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT r.base_time_min, o.delivery_time, o.id, o.value_rs FROM orders o LEFT JOIN routes r ON o.route_id = r.route_id;");
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default infoRouter;