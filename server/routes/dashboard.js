// server/routes/dashboard.js
import express from "express";
import pool from "../db.js";

const dashboardRouter = express.Router();

// GET /dashboard/latest
dashboardRouter.get("/latest", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM simulation_history ORDER BY created_at DESC LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No simulation history found." });
    }

    const sim = result.rows[0];
    res.json(sim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default dashboardRouter;
