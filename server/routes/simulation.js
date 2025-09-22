// server/routes/simulation.js
import express from "express";
import pool from "../db.js";

const simulationRouter = express.Router();

// Convert "HH:MM" string to total minutes
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes to "HH:MM"
const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// Shuffle array
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

// POST /simulation
simulationRouter.post("/", async (req, res) => {
  try {
    const { numDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    // Validate inputs
    if (!numDrivers || !routeStartTime || !maxHoursPerDriver || numDrivers <= 0 || maxHoursPerDriver <= 0) {
      return res.status(400).json({ error: "Invalid or missing parameters." });
    }

    // Fetch orders with routes
    const ordersRes = await pool.query(`
      SELECT o.id, o.value_rs, o.delivery_time, r.route_id, r.base_time_min, r.distance_km, r.traffic_level
      FROM orders o
      LEFT JOIN routes r ON o.route_id = r.route_id
    `);
    let orders = ordersRes.rows;
    if (!orders.length) return res.status(404).json({ error: "No orders found." });

    orders = shuffle(orders);

    // Initialize drivers
    const drivers = Array.from({ length: numDrivers }, (_, i) => ({ id: i + 1, totalHours: 0, orders: [] }));

    let onTimeDeliveries = 0;
    let totalFuelBase = 0;
    let totalFuelSurcharge = 0;
    let totalPenalties = 0;
    let totalBonuses = 0;

    const startMinutes = timeToMinutes(routeStartTime);

    orders.forEach(order => {
      // Assign to driver with least hours
      const driver = drivers.reduce((a, b) => (a.totalHours < b.totalHours ? a : b));

      const baseTime = order.base_time_min;

      // Apply driver fatigue if working hours exceed max
      const fatigueMultiplier = driver.totalHours > maxHoursPerDriver ? 1.3 : 1;
      const deliveryTime = baseTime * fatigueMultiplier;

      // Fuel cost
      const fuelCostBase = order.distance_km * 5;
      const fuelCostSurcharge = order.traffic_level === "High" ? order.distance_km * 2 : 0;
      const totalFuelCost = fuelCostBase + fuelCostSurcharge;

      totalFuelBase += fuelCostBase;
      totalFuelSurcharge += fuelCostSurcharge;

      // Penalty and bonus
      const isLate = deliveryTime > baseTime + 10;
      const penalty = isLate ? 50 : 0;
      const bonus = !isLate && order.value_rs > 1000 ? order.value_rs * 0.1 : 0;

      totalPenalties += penalty;
      totalBonuses += bonus;

      const profit = order.value_rs + bonus - penalty - totalFuelCost;

      driver.totalHours += deliveryTime / 60;
      driver.orders.push({
        id: order.id,
        profit: parseFloat(profit.toFixed(2)),
        deliveryTime: minutesToTime(deliveryTime),
        late: isLate,
        fuelCostBase: parseFloat(fuelCostBase.toFixed(2)),
        fuelCostSurcharge: parseFloat(fuelCostSurcharge.toFixed(2))
      });

      if (!isLate) onTimeDeliveries++;
    });

    const totalProfit = drivers.reduce((sum, d) => sum + d.orders.reduce((s, o) => s + o.profit, 0), 0);
    const efficiency = ((onTimeDeliveries / orders.length) * 100).toFixed(2);
    const lateDeliveries = orders.length - onTimeDeliveries;

    // Insert into simulation_history
    const insertQuery = `
      INSERT INTO simulation_history
      (num_drivers, route_start_time, max_hours_per_driver, total_profit, efficiency, on_time_deliveries, late_deliveries, total_penalties, total_bonuses, fuel_cost_base, fuel_cost_surcharge)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `;
    await pool.query(insertQuery, [
      numDrivers,
      routeStartTime,
      maxHoursPerDriver,
      parseFloat(totalProfit.toFixed(2)),
      parseFloat(efficiency),
      onTimeDeliveries,
      lateDeliveries,
      parseFloat(totalPenalties.toFixed(2)),
      parseFloat(totalBonuses.toFixed(2)),
      parseFloat(totalFuelBase.toFixed(2)),
      parseFloat(totalFuelSurcharge.toFixed(2))
    ]);

    res.json({
      drivers,
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      efficiency,
      onTimeDeliveries,
      lateDeliveries,
      totalPenalties: parseFloat(totalPenalties.toFixed(2)),
      totalBonuses: parseFloat(totalBonuses.toFixed(2)),
      fuelCostBase: parseFloat(totalFuelBase.toFixed(2)),
      fuelCostSurcharge: parseFloat(totalFuelSurcharge.toFixed(2))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default simulationRouter;

