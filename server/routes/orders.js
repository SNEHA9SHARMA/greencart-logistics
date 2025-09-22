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

export default router;

