// ManualPriceCalculator.js
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const ManualPriceCalculator = () => {
  const { property_id } = useParams(); // dynamic param from route
  const location = useLocation(); // used to receive state if passed from another component

  const [property, setProperty] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);

  // Fallback to 0% if state is not provided
  const gstPercent = location.state?.gst_percent || 0;
  const registrationPercent = location.state?.registration_percent || 0;
  const propertyTaxPercent = location.state?.property_tax_percent || 0;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/properties/${property_id}`)
      .then((res) => {
        const base = res.data.base_price;
        setProperty(res.data);

        const totalTax =
          (gstPercent * base) / 100 +
          (registrationPercent * base) / 100 +
          (propertyTaxPercent * base) / 100;

        setFinalPrice(base + totalTax);
      })
      .catch((err) => {
        console.error("Error fetching property:", err);
        alert("Failed to load property data.");
      });
  }, [property_id, gstPercent, registrationPercent, propertyTaxPercent]);

  return (
    <div className="container">
      <h2>Manual Price Calculator</h2>
      {property ? (
        <>
          <p><strong>Property ID:</strong> {property.property_id}</p>
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Base Price:</strong> ₹{property.base_price}</p>
          <p>
            <strong>GST ({gstPercent}%):</strong>{" "}
            ₹{((gstPercent * property.base_price) / 100).toFixed(2)}
          </p>
          <p>
            <strong>Registration ({registrationPercent}%):</strong>{" "}
            ₹{((registrationPercent * property.base_price) / 100).toFixed(2)}
          </p>
          <p>
            <strong>Property Tax ({propertyTaxPercent}%):</strong>{" "}
            ₹{((propertyTaxPercent * property.base_price) / 100).toFixed(2)}
          </p>
          <h3>Total Price: ₹{finalPrice?.toFixed(2)}</h3>
        </>
      ) : (
        <p>Loading property data...</p>
      )}
    </div>
  );
};

export default ManualPriceCalculator;
