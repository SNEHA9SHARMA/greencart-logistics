import express from "express";
import pool from "../db.js"; // your PostgreSQL pool connection

const driversRouter = express.Router();

// GET all drivers
driversRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers");
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
driversRouter.post("/add", async (req, res) => {
  try {
    const { name, shift_hours, past_week_hours } = req.body;

    if (!name || !shift_hours) {
      return res.status(400).json({ error: "Name and shift_hours are required" });
    }

    const result = await pool.query(
      `INSERT INTO drivers (name, shift_hours, past_week_hours) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, shift_hours, past_week_hours || ""]
    );

    res.status(201).json({
      message: "Driver created successfully",
      driver: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating driver:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default driversRouter;

