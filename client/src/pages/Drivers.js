import React, { useEffect, useState } from 'react';
import { fetchDrivers,addDriver,updateDriver,deleteDriver } from '../api/api';
import "./Drivers.css"

//======================CREATE====================================
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
   
   <div className="Create-Driver-Page" style={{ marginBottom: "1rem" }}>
    <h3>Add New Driver</h3>
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
        <button onClick={handleCreateDriver}>Add</button>
      </div>
  );
};

//========================READ======================================
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
    <div className="Read-Driver-Page">
      <h3>Drivers</h3>
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

//========================UPDATE======================================
const UpdateDrivers=()=>{
  const [driverId, setDriverId] = useState("");
  const [updatedDriver,setUpdatedDriver]=useState({
    name:"", shift_hours:"",past_week_hours:"",
  });
  const handleUpdateDriver=async ()=>{
    try{
       const res = await updateDriver(driverId, updatedDriver);
       alert("Driver updated successfully!");
       setDriverId("");
       setUpdatedDriver({ name: "", shift_hours: "", past_week_hours: "" });
    }catch (err) {
      console.error("Failed to update driver:", err);
      alert("Error updating driver");
    }
  }
  return(
    <div className="Update-Driver-Page">
      <h3>Update Details of Driver</h3>
      <input className="id-update" type="text"
        placeholder="Driver ID"
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}/>
      <input
        type="text"
        placeholder="Name"
        value={updatedDriver.name}
        onChange={(e) =>
          setUpdatedDriver({ ...updatedDriver, name: e.target.value })
        }
      />
       <input
        type="number"
        placeholder="Shift Hours"
        value={updatedDriver.shift_hours}
        onChange={(e) =>
          setUpdatedDriver({ ...updatedDriver, shift_hours: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Past Week Hours (6|7|8|6|7|8|9)"
        value={updatedDriver.past_week_hours}
        onChange={(e) =>
          setUpdatedDriver({
            ...updatedDriver,
            past_week_hours: e.target.value,
          })
        }
      />
      <button onClick={handleUpdateDriver}>Update</button>
      

    </div>
  );

};

//========================DELETE======================================
const DeleteDrivers = () => {
  const [driverId, setDriverId] = useState("");

  const handleDeleteDriver = async () => {
    if (!driverId) {
      alert("Please enter a Driver ID to delete.");
      return;
    }

    try {
      const res = await deleteDriver(driverId);
      console.log("Driver deleted:", res.data);
      alert("Driver deleted successfully!");
      setDriverId(""); // reset input
    } catch (err) {
      console.error("Failed to delete driver:", err);
      alert("Error deleting driver.");
    }};
      return (
    <div className="Delete-Driver-Page">
      <h3>Remove Driver</h3>
      <input
        type="text"
        placeholder="Driver ID"
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
      />
      <button onClick={handleDeleteDriver}>Remove</button>
    </div>
  );
};
const DriversManagement = () => {
  const [active, setActive] = useState("menu"); // "menu" means buttons are visible

  const renderContent = () => {
    switch (active) {
      case "view":
        return <ReadDrivers />;
      case "add":
        return <AddDrivers />;
      case "update":
        return <UpdateDrivers />;
      case "delete":
        return <DeleteDrivers />;
      default:
        return null;
    }
  };

  return (
    <div className="Management">
      <h2>Manage Drivers</h2>

      {/* Show menu if active = menu */}
      {active === "menu" && (
        <div className="button-group">
          <button onClick={() => setActive("view")}>View</button>
          <button onClick={() => setActive("add")}>Add</button>
          <button onClick={() => setActive("update")}>Update</button>
          <button onClick={() => setActive("delete")}>Remove</button>
        </div>
      )}

      {/* Show selected component with a Back button */}
      {active !== "menu" && (
        <div>
          {renderContent()}
          <button
            style={{ marginTop: "1rem" }}
            onClick={() => setActive("menu")}
          >
            ⬅ Back
          </button>
        </div>
      )}
    </div>
  );
};

export default DriversManagement;