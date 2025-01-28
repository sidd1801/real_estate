import './style/SignUp.css'
import React, { useState } from "react";
function UserSignUp()  {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "Buyer",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add submission logic here
  };

  return (
    <div className="form-container">
      <h2>Register Now</h2>
      <p>Register as a Buyer</p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userType">User Type</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="Buyer">Buyer</option>
            <option value="Agent">Agent</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>

    )
}

export default UserSignUp
