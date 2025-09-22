import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
export default function Navbar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setToken(null); 
    navigate("/");  
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/simulation">Simulation</Link></li>
        <li><Link to="/drivers">Drivers</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/routes">Routes</Link></li>
        <li className="logout-btn"><button onClick={handleLogout} style={{ marginLeft: "auto" }}>
        Logout
      </button></li>
      </ul>

      
    </nav>
  );
}

