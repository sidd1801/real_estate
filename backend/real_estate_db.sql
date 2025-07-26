CREATE DATABASE IF NOT EXISTS real_estate_db;
USE real_estate_db;



-- 1. Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Users
INSERT INTO Users (name, email, phone) VALUES 
('Siddhant Sinha', 'siddhant@example.com', '9876543210'),
('Amit Rao', 'amit@example.com', '9123456780');

-- 2. Agents Table
CREATE TABLE Agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    license_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Agents
INSERT INTO Agents (name, email, phone, license_number) VALUES 
('Agent Smith', 'smith@realestate.com', '9000000001', 'LIC12345'),
('Agent John', 'john@realestate.com', '9000000002', 'LIC54321');

-- 3. Properties Table
CREATE TABLE Properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    agent_id INT,
    title VARCHAR(100),
    location VARCHAR(100),
    price DECIMAL(12,2),
    size_sqft INT,
    description TEXT,
    status ENUM('sold', 'unsold', 'rent') DEFAULT 'unsold',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (agent_id) REFERENCES Agents(id)
);

-- Sample Properties
INSERT INTO Properties (user_id, agent_id, title, location, price, size_sqft, description, status) VALUES
(1, 1, 'Luxury Apartment', 'Mumbai', 12000000, 1200, '3 BHK sea-facing flat', 'sold'),
(2, 2, 'Budget Flat', 'Delhi', 5000000, 800, 'Affordable 2 BHK flat', 'unsold'),
(1, 1, 'Villa on Rent', 'Bangalore', 300000, 2500, '4 BHK spacious villa', 'rent');

-- 4. SoldProperties Table
CREATE TABLE SoldProperties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT UNIQUE,
    sold_date DATE,
    sold_price DECIMAL(12,2),
    buyer_name VARCHAR(100),
    FOREIGN KEY (property_id) REFERENCES Properties(id)
);

-- Sample Sold Property
INSERT INTO SoldProperties (property_id, sold_date, sold_price, buyer_name) VALUES
(1, '2024-10-10', 11800000, 'Rahul Khanna');

-- 5. UnsoldProperties Table
CREATE TABLE UnsoldProperties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT UNIQUE,
    listed_date DATE,
    FOREIGN KEY (property_id) REFERENCES Properties(id)
);

-- Sample Unsold Property
INSERT INTO UnsoldProperties (property_id, listed_date) VALUES
(2, '2025-06-15');

-- 6. RentProperties Table
CREATE TABLE RentProperties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT UNIQUE,
    rent_per_month DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (property_id) REFERENCES Properties(id)
);

-- Sample Rent Property
INSERT INTO RentProperties (property_id, rent_per_month, is_available) VALUES
(3, 25000, TRUE);

-- 7. location_charges Table (for tax calculation)
CREATE TABLE location_charges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) UNIQUE,
    gst_percent DECIMAL(5,2),
    registration_percent DECIMAL(5,2),
    property_tax_percent DECIMAL(5,2)
);

-- Sample Location Charges
INSERT INTO location_charges (location, gst_percent, registration_percent, property_tax_percent) VALUES
('Mumbai', 5.0, 7.0, 1.5),
('Delhi', 4.5, 6.5, 1.2),
('Bangalore', 6.0, 8.0, 2.0);
