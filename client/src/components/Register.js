// Register.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      try {
        const res = await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000"
          }/api/users/register`,
          {
            name,
            email,
            password,
          }
        );
        alert(res.data.message);
        navigate("/login"); // Redirect to login page after successful registration
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.response?.data?.message || "Connection to server failed");
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={onChange}
        required
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        required
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        required
        placeholder="Password"
      />
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={onChange}
        required
        placeholder="Confirm Password"
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
