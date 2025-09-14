import React, { useEffect, useState } from "react";
import { me, updateProfile } from "../api"; // ensure updateProfile handles FormData

export default function Profile() {
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await me();
        setRes(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profile_picture: null, // don't preload file object
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("access");
    try {
      // Build multipart FormData
      const fd = new FormData();
      fd.append("username", formData.username);
      fd.append("email", formData.email);
      fd.append("bio", formData.bio);

      if(profilePicture){
        fd.append("profile_picture", profilePicture);
      }
      

      const updated = await updateProfile(token, fd); // must accept FormData
      setRes(updated);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally { 
      setSaving(false);
    }
  };

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

  // Ensure image URL works whether absolute or relative
  const profilePic = res.profile_picture?.startsWith("http")
    ? res.profile_picture
    : res.profile_picture
    ? `http://127.0.0.1:8000${res.profile_picture}`
    : "https://via.placeholder.com/120?text=User";

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body text-center">
        <img
          src={profilePic}
          alt={res.username}
          className="rounded-circle mb-3"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />

        {!editing ? (
          <>
            <h4 className="card-title">{res.username}</h4>
            <p className="text-muted mb-1">{res.email}</p>
            <p className="card-text">{res.bio || "No bio available."}</p>
            <button
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-2 text-start">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-2 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-2 text-start">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Profile Picture</label>
              <input
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                className="form-control"
                accept="image/*"
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
