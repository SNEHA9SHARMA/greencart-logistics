import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

export const fetchDrivers = () => API.get("/drivers");
export const fetchRoutes = () => API.get("/routes");
export const fetchOrders = () => API.get("/orders");
export const fetchSimulation = () => API.get("/simulation");
export const fetchInfo=()=>API.get("/info");
export const runSimulation = () => API.post("/simulation/run");


