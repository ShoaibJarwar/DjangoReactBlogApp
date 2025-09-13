import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    bio: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (profilePicture) {
      data.append("profile_picture", profilePicture);
    }
  
    try {
      setLoading(true);
      await registerUser(data);
      toast.success("Account created successfully! 🎉");
      navigate("/login");
      setFormData({
        username: "",
        email: "",
        password: "",
        password2: "",
        bio: "",
      });
      setProfilePicture(null);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4" style={{ maxWidth: "450px", margin: "2rem auto" }}>
      <h2 className="text-center mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username} 
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="password2"
            className="form-control"
            value={formData.password2}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            className="form-control"
            placeholder="Tell us about yourself"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {/* Profile Picture */}
        <div className="mb-3">
          <label className="form-label">Profile Picture</label>
          <input
            type="file"
            className="form-control"
            name="profile_picture"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
