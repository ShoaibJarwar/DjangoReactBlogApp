import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UseAuth } from "../context/AuthContext";

export default function Header() {
  const { state, dispatch } = UseAuth();

  const handleLogout = () => {
    localStorage.removeItem("access");
    dispatch({ type: "LOGOUT" });
    toast.info("You have been logged out.");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold"
            style={{ color: "#f8d210", fontSize: "1.3rem" }}
          >
            🚀 Blog Post App
          </span>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <div className="ms-auto d-flex flex-column flex-lg-row gap-2">
              {state.user ? (
                <>
                  <button
                    className="btn btn-outline-light btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#dashboardModal"
                  >
                    📊 Dashboard
                  </button>
                  <button
                    className="btn btn-outline-light btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#profileModal"
                  >
                    👤 Profile
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-sm btn-outline-light" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-sm btn-primary" to="/register">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Info Banner */}
      <div
        className="text-center text-white py-2 px-3"
        style={{
          background: "linear-gradient(90deg, #007bff, #6610f2)",
          fontSize: "0.95rem",
        }}
      >
        Welcome <strong>{state.user?.username || ""}</strong>! 🚀 Manage
        your posts, explore categories, and customize your profile.
      </div>
    </>
  );
}
