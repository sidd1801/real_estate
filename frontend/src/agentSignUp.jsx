import './style/SignUp.css';
import React, { useState } from 'react';

function AgentSignUp() {
  const [formData, setFormData] = useState({
    agentCompany: "",
    agentName: "",
    experience: "",
    location: "",
    languages: "",
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
      <p>Register as an Agent</p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="agentCompany">Agent Company</label>
          <input
            type="text"
            id="agentCompany"
            name="agentCompany"
            value={formData.agentCompany}
            onChange={handleChange}
            placeholder="Enter your company name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="agentName">Agent Name</label>
          <input
            type="text"
            id="agentName"
            name="agentName"
            value={formData.agentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Enter years of experience"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="languages">Languages</label>
          <textarea
            id="languages"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="Enter languages you speak (e.g., English, Spanish)"
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
  );
}

export default AgentSignUp;
