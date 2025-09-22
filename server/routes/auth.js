import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const authRouter = express.Router();

// Register manager (run once)
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO managers (username, password) VALUES ($1, $2)", [username, hashedPassword]);
  res.json({ message: "Manager registered" });
});

// Login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userRes = await pool.query("SELECT * FROM managers WHERE username = $1", [username]);
  const user = userRes.rows[0];
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

export default authRouter;
