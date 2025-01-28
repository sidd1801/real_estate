import './style/SignUp.css';
import React, { useState } from 'react';

function PropertyRegister() {
  const [formData, setFormData] = useState({
    propertyID: '',
    agentID: '',
    status: 'Available',
    address: '',
    zipCode: '',
    city: '',
    state: '',
    squareFeet: '',
    price: '',
    type: 'Residential',
    lotSize: '',
    beds: '',
    baths: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add submission logic here
  };

  return (
    <div className="form-container">
      <h2>Property Details</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="propertyID">Property ID</label>
            <input
              type="text"
              id="propertyID"
              name="propertyID"
              value={formData.propertyID}
              onChange={handleChange}
              placeholder="Enter Property ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="agentID">Agent ID</label>
            <input
              type="text"
              id="agentID"
              name="agentID"
              value={formData.agentID}
              onChange={handleChange}
              placeholder="Enter Agent ID"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Property Address"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Enter Zip Code"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter City"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter State"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="squareFeet">Square Feet</label>
            <input
              type="text"
              id="squareFeet"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              placeholder="Enter Square Feet"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter Price"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lotSize">Lot Size</label>
            <input
              type="text"
              id="lotSize"
              name="lotSize"
              value={formData.lotSize}
              onChange={handleChange}
              placeholder="Enter Lot Size (in acres)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="beds">Beds</label>
            <input
              type="text"
              id="beds"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              placeholder="Enter Number of Beds"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="baths">Baths</label>
            <input
              type="text"
              id="baths"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              placeholder="Enter Number of Baths"
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PropertyRegister;
