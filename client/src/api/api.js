import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});



export const fetchSimulation = () => API.get("/simulation");
export const fetchInfo=()=>API.get("/info");

//   =========Drivers CRUD endpoints==========              
export const fetchDrivers = () => API.get("/drivers");
export const updateDriver=(id,driverData)=>API.put(`/drivers/${id}`,driverData);
export const addDriver = (driverData) => API.post("/drivers/add", driverData);
export const deleteDriver=(id)=>API.delete(`/drivers/${id}`);

//   ==========Routes CRUD endpoints==========              
export const fetchRoutes = () => API.get("/routes");

//   ==========Orders CRUD endpoints==========  
export const fetchOrders = () => API.get("/orders");


export const runSimulation = () => API.post("/simulation/run");


