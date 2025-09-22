import { useState } from "react";
import axios from "axios";
import "./Login.css"
export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { username, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch(err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
