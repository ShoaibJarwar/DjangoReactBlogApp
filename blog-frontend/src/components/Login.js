import React, { useState } from "react";
import { loginUser } from "../api";
import { UseAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { dispatch } = UseAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await loginUser(username, password);
      dispatch({
        type: "LOGIN",
        payload: { user: { username }, token: localStorage.getItem("access") },
      });
      toast.success("Login successful!");
      navigate("/posts");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border-0 rounded-3 p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center text-primary">
            <i className="bi bi-person-circle me-2"></i> Login
          </h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-lg">
              <i className="bi bi-box-arrow-in-right me-2"></i> Login
            </button>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Don’t have an account? <a href="/register">Register</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
