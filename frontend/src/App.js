import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import PriceCalculator from "./PriceCalculator";
import "./styles.css";

const AdminPanel = () => {
  const [table, setTable] = useState("users");
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [updateColumn, setUpdateColumn] = useState("");
  const [updateValue, setUpdateValue] = useState("");
  const [deleteColumn, setDeleteColumn] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttributes();
  }, [table]);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/attributes", {
        params: { table },
      });
      setAttributes(response.data);
      setFormData({});
      setData([]);
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFetch = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/fetch", {
        params:
          filterColumn && filterValue
            ? {
                table,
                filter_column: filterColumn,
                filter_value: filterValue,
              }
            : { table },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 const handleInsert = async () => {
  try {
    await axios.post("http://127.0.0.1:5000/api/insert", {
      table,
      data: formData, // ✅ FIXED from 'values' to 'data'
    });
    alert("Data inserted successfully!");
    handleFetch();
    setFormData({});
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};


  const handleUpdate = async () => {
  if (!filterColumn || !filterValue || !updateColumn || !updateValue) {
    alert("Please provide filter and update values.");
    return;
  }
  try {
    await axios.put("http://127.0.0.1:5000/api/update", {
      table,
      filters: { [filterColumn]: filterValue }, // ✅ FIXED
      updates: { [updateColumn]: updateValue }, // ✅ FIXED
    });
    alert("Data updated successfully!");
    handleFetch();
  } catch (error) {
    console.error("Error updating data:", error);
  }
};


  const handleDelete = async () => {
    if (!deleteColumn || !deleteValue) {
      alert("Please select column and value to delete.");
      return;
    }
    try {
      await axios.delete("http://127.0.0.1:5000/api/delete", {
        data: {
          table,
          filter_column: deleteColumn,
          filter_value: deleteValue,
        },
      });
      alert("Data deleted successfully!");
      handleFetch();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Real Estate Management</h1>

      <label>Select Table:</label>
      <select
        onChange={(e) => setTable(e.target.value)}
        className="dropdown"
        value={table}
      >
        <option value="users">Users</option>
        <option value="agents">Agents</option>
        <option value="properties">Properties</option>
        <option value="soldproperties">Sold Properties</option>
        <option value="unsoldproperties">Unsold Properties</option>
        <option value="rentproperties">Rent Properties</option>
      </select>

      <h2 className="subtitle">Fetch Data</h2>
      <label>Filter Column:</label>
      <select
        onChange={(e) => setFilterColumn(e.target.value)}
        className="dropdown"
        value={filterColumn}
      >
        <option value="">Fetch All</option>
        {attributes.map((attr, index) => (
          <option key={index} value={attr}>
            {attr}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter filter value"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="input-box"
      />
      <button onClick={handleFetch} className="button">
        FETCH DATA
      </button>

      <h2 className="subtitle">Insert Data</h2>
      {attributes.map(
        (attr, index) =>
          attr.toLowerCase() !== "id" &&
          !attr.toLowerCase().includes("auto") && (
            <input
              key={index}
              type="text"
              name={attr}
              placeholder={attr}
              value={formData[attr] || ""}
              onChange={handleInputChange}
              className="input-box"
            />
          )
      )}
      <button onClick={handleInsert} className="button">
        INSERT DATA
      </button>

      <h2 className="subtitle">Update Data</h2>
      <label>Filter Column:</label>
      <select
        onChange={(e) => setFilterColumn(e.target.value)}
        className="dropdown"
        value={filterColumn}
      >
        <option value="">Select Column</option>
        {attributes.map((attr, index) => (
          <option key={index} value={attr}>
            {attr}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter filter value"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="input-box"
      />

      <label>Column to Update:</label>
      <select
        onChange={(e) => setUpdateColumn(e.target.value)}
        className="dropdown"
        value={updateColumn}
      >
        <option value="">Select Column</option>
        {attributes.map((attr, index) => (
          <option key={index} value={attr}>
            {attr}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter new value"
        value={updateValue}
        onChange={(e) => setUpdateValue(e.target.value)}
        className="input-box"
      />
      <button onClick={handleUpdate} className="button">
        UPDATE DATA
      </button>

      <h2 className="subtitle">Delete Data</h2>
      <label>Column:</label>
      <select
        onChange={(e) => setDeleteColumn(e.target.value)}
        className="dropdown"
        value={deleteColumn}
      >
        <option value="">Select Column</option>
        {attributes.map((attr, index) => (
          <option key={index} value={attr}>
            {attr}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter value to delete"
        value={deleteValue}
        onChange={(e) => setDeleteValue(e.target.value)}
        className="input-box"
      />
      <button onClick={handleDelete} className="button">
        DELETE DATA
      </button>

      {data.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key.toUpperCase()}</th>
              ))}
              {table === "properties" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
                {table === "properties" && (
                  <td>
                    <button
                      onClick={() => navigate(`/calculate/${item.id}`)}
                      className="button"
                    >
                      Calculate Price
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AdminPanel />} />
      <Route path="/calculate/:id" element={<PriceCalculator />} />
    </Routes>
  </Router>
);

export default App;
