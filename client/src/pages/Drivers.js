import React, { useEffect, useState } from 'react';
import { fetchDrivers,addDriver } from '../api/api';
import "./Drivers.css"
const ReadDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const res = await fetchDrivers();
        console.log(res.data);
        setDrivers(Array.isArray(res.data) ? res.data : res.data.drivers || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setDrivers([]);
      }
    };

    getDrivers();
  }, []);

  return (
    <div className="drivers">
      <h2>Drivers</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Shift Hours</th>
      <th>Past Week Hours</th>
    </tr>
  </thead>
  <tbody>
    {drivers.map((driver) => (
      <tr key={driver.id}>
        <td>{driver.id}</td>
        <td>{driver.name}</td>
        <td>{driver.shift_hours}</td>
        <td>{driver.past_week_hours}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};
const AddDrivers = () => {
const [newDriver, setNewDriver] = useState({
    name: "",
    shift_hours: "",
    past_week_hours: "",
  });
 const handleCreateDriver = async () => {
    try {
      const res = await addDriver(newDriver);
      setNewDriver({ name: "", shift_hours: "", past_week_hours: "" }); // reset form
    } catch (err) {
      console.error("Failed to create driver:", err);
    }
  };
  return (
   
   <div style={{ marginBottom: "1rem" }}>
    <h2>Add New Driver</h2>
        <input
          type="text"
          placeholder="Name"
          value={newDriver.name}
          onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Shift Hours"
          value={newDriver.shift_hours}
          onChange={(e) =>
            setNewDriver({ ...newDriver, shift_hours: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Past Week Hours (e.g. 6|7|8|6|7|8|9)"
          value={newDriver.past_week_hours}
          onChange={(e) =>
            setNewDriver({ ...newDriver, past_week_hours: e.target.value })
          }
        />
        <button onClick={handleCreateDriver}>Add Driver</button>
      </div>
  );
};
import React, { useEffect, useState } from 'react';
import { fetchDrivers } from '../api/api';
import "./Drivers.css"
const readDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const res = await fetchDrivers();
        console.log(res.data);
        setDrivers(Array.isArray(res.data) ? res.data : res.data.drivers || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setDrivers([]);
      }
    };

    getDrivers();
  }, []);

  return (
    <div className="drivers">
      <h2>Drivers</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Shift Hours</th>
      <th>Past Week Hours</th>
    </tr>
  </thead>
  <tbody>
    {drivers.map((driver) => (
      <tr key={driver.id}>
        <td>{driver.id}</td>
        <td>{driver.name}</td>
        <td>{driver.shift_hours}</td>
        <td>{driver.past_week_hours}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};
const addDrivers = () => {
const [newDriver, setNewDriver] = useState({
    name: "",
    shift_hours: "",
    past_week_hours: "",
  });
 const handleCreateDriver = async () => {
    try {
      const res = await createDriver(newDriver);
      setNewDriver({ name: "", shift_hours: "", past_week_hours: "" }); // reset form
    } catch (err) {
      console.error("Failed to create driver:", err);
    }
  };
  return (
   
   <div style={{ marginBottom: "1rem" }}>
    <h2>Add New Driver</h2>
        <input
          type="text"
          placeholder="Name"
          value={newDriver.name}
          onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Shift Hours"
          value={newDriver.shift_hours}
          onChange={(e) =>
            setNewDriver({ ...newDriver, shift_hours: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Past Week Hours (e.g. 6|7|8|6|7|8|9)"
          value={newDriver.past_week_hours}
          onChange={(e) =>
            setNewDriver({ ...newDriver, past_week_hours: e.target.value })
          }
        />
        <button onClick={handleCreateDriver}>Add Driver</button>
      </div>
  );
};
const Drivers = () => {
  const [active, setActive] = useState(null); // null | "view" | "add"

  return (
    <div>
      <button onClick={() => setActive("view")}>View</button>
      <button onClick={() => setActive("add")}>Add Driver</button>

      {active === "view" && <ReadDrivers />}   {/* Render component */}
      {active === "add" && <AddDrivers />}     {/* Render component */}
    </div>
  );
};
export default Drivers;
