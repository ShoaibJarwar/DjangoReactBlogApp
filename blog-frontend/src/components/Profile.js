import React, { useEffect, useState } from "react";
import { me } from "../api"; // async function to fetch current user

export default function Profile() {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await me();
        setRes(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!res) {
    return (
      <div className="alert alert-danger text-center">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body text-center">
        <img
          src={
            res.profile_picture
              ? `http://127.0.0.1:8000${res.profile_picture}`
              : "https://via.placeholder.com/120?text=User"
          }
          alt={res.username}
          className="rounded-circle mb-3"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <h4 className="card-title">{res.username}</h4>
        <p className="text-muted mb-1">{res.email}</p>
        <p className="card-text">
          {res.bio ? res.bio : "No bio available."}
        </p>
        <button className="btn btn-outline-primary btn-sm mt-2">
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  );
}
