import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const PriceCalculator = () => {
  const { id } = useParams();
  const location = useLocation();

  const [priceDetails, setPriceDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Defaults if location.state is not passed
  const {
    gst_percent = 5,
    registration_percent = 2,
    property_tax_percent = 1,
  } = location.state || {};

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.post(`http://127.0.0.1:5000/api/calculate-price/${id}`, {
          gst_percent,
          registration_percent,
          property_tax_percent,
        });
        setPriceDetails(response.data);
      } catch (err) {
        console.error("Calculation error:", err);
        setError("Failed to calculate property price.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [id, gst_percent, registration_percent, property_tax_percent]);

  if (loading) return <div>Calculating price...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!priceDetails) return null;

  return (
    <div className="container">
      <h2 className="title">Price Breakdown for Property #{priceDetails.property_id}</h2>
      <p><strong>Location:</strong> {priceDetails.location}</p>
      <table className="data-table">
        <tbody>
          <tr><td>Base Price</td><td>₹ {priceDetails.base_price}</td></tr>
          <tr><td>GST ({priceDetails.gst_percent}%)</td><td>₹ {priceDetails.gst}</td></tr>
          <tr><td>Registration ({priceDetails.registration_percent}%)</td><td>₹ {priceDetails.registration}</td></tr>
          <tr><td>Property Tax ({priceDetails.property_tax_percent}%)</td><td>₹ {priceDetails.property_tax}</td></tr>
          <tr><td><strong>Total Price</strong></td><td><strong>₹ {priceDetails.total_price}</strong></td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default PriceCalculator;
