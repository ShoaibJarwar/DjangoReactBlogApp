import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Posts from "./components/Posts";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "../src/components/Header"; 
import Footer from "../src/components/Footer";
// import AITextGenerator from "./components/AITextGenerator";
import { UseAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App"

function App() {
  const { state } = UseAuth();

  return (
    <Router>
      {/* Global Navbar */}
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">
          📝 My Blog
        </Link>
        <div className="ms-auto">
          {state.user ? (
            <>
              <span className="text-light me-3">
                Welcome, <strong>{state.user.username}</strong>
              </span>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => dispatch({ type: "LOGOUT" })}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-outline-light me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-sm btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav> */}

      {/* Routes */}
      <div className="container">
        <Header />
        {/* <AITextGenerator token={state.token} onInsert={insertGeneratedText} /> */}
        <Routes>
          <Route
            path="/"
            element={
              state.user ? <Navigate to="/posts" /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/posts"
            element={state.user ? <Posts /> : <Navigate to="/login" />}
          />
          {/* Fallback route */}
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
        <Footer />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
