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

export default driversRouter;

