import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import dashboardRouter from "./routes/dashboard.js";
// Import routes
import driversRouter from "./routes/drivers.js";
import routesRouter from "./routes/routes.js";
import ordersRouter from "./routes/orders.js";
import simulationRouter from "./routes/simulation.js";
import infoRouter from "./routes/info.js";
import authRouter from "./routes/auth.js";   // ⬅️ Add this
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// API routes
app.use("/drivers", driversRouter);
app.use("/routes", routesRouter);
app.use("/orders", ordersRouter);
app.use("/simulation", simulationRouter);
app.use("/info", infoRouter);
app.use("/auth", authRouter);  
app.use("/dashboard", dashboardRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
