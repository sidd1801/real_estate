from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Siddhant@18012003",
    database="real_estate_db"
)
cursor = db.cursor(dictionary=True)

# All tables in the database
TABLES = {
    "users": "Users",
    "agents": "Agents",
    "properties": "Properties",
    "soldproperties": "SoldProperties",
    "unsoldproperties": "UnsoldProperties",
    "rentproperties": "RentProperties"
}

# -----------------------------
# Get table attributes dynamically
# -----------------------------
@app.route('/api/attributes', methods=['GET'])
def get_table_attributes():
    table = request.args.get('table')

    if table not in TABLES:
        return jsonify({"error": "Invalid table"}), 400

    query = f"DESCRIBE {TABLES[table]}"
    cursor.execute(query)
    attributes = [row["Field"] for row in cursor.fetchall()]
    return jsonify(attributes)

# -----------------------------
# Fetch data dynamically
# -----------------------------
@app.route('/api/fetch', methods=['GET'])
def fetch_data():
    table = request.args.get('table')
    filter_column = request.args.get('filter_column')
    filter_value = request.args.get('filter_value')

    if table not in TABLES:
        return jsonify({"error": "Invalid table"}), 400

    query = f"SELECT * FROM {TABLES[table]}"
    values = ()

    if filter_column and filter_value:
        query += f" WHERE {filter_column}=%s"
        values = (filter_value,)

    try:
        cursor.execute(query, values)
        data = cursor.fetchall()
        return jsonify(data)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Insert data dynamically
# -----------------------------
@app.route('/api/insert', methods=['POST'])
def insert_data():
    table = request.json.get("table")
    data = request.json.get("data")

    if table not in TABLES or not data:
        return jsonify({"error": "Invalid table or data"}), 400

    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    values = tuple(data.values())

    query = f"INSERT INTO {TABLES[table]} ({columns}) VALUES ({placeholders})"
    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Record inserted successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Update data dynamically
# -----------------------------
@app.route('/api/update', methods=['PUT'])
def update_data():
    table = request.json.get("table")
    filter_column = request.json.get("filter_column")
    filter_value = request.json.get("filter_value")
    update_column = request.json.get("update_column")
    update_value = request.json.get("update_value")

    if table not in TABLES or not filter_column or not filter_value or not update_column or not update_value:
        return jsonify({"error": "Invalid update parameters"}), 400

    query = f"UPDATE {TABLES[table]} SET {update_column}=%s WHERE {filter_column}=%s"
    values = (update_value, filter_value)

    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Record updated successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Delete data dynamically
# -----------------------------
@app.route('/api/delete', methods=['DELETE'])
def delete_data():
    table = request.json.get("table")
    filter_column = request.json.get("filter_column")
    filter_value = request.json.get("filter_value")

    if table not in TABLES or not filter_column or not filter_value:
        return jsonify({"error": "Invalid delete parameters"}), 400

    query = f"DELETE FROM {TABLES[table]} WHERE {filter_column}=%s"
    values = (filter_value,)

    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Record deleted successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Calculate property price (NEW)
# -----------------------------
@app.route('/api/calculate-price/<int:property_id>', methods=['GET'])
def calculate_property_price(property_id):
    try:
        # Step 1: Get property info
        cursor.execute("SELECT * FROM Properties WHERE id = %s", (property_id,))
        property_data = cursor.fetchone()

        if not property_data:
            return jsonify({"error": "Property not found"}), 404

        base_price = property_data.get('price')
        location = property_data.get('location')

        # Step 2: Get location-specific tax rates
        cursor.execute("SELECT * FROM location_charges WHERE location = %s", (location,))
        charges = cursor.fetchone()

        if not charges:
            return jsonify({"error": f"No tax data found for location: {location}"}), 404

        # Step 3: Calculate components
        gst = base_price * (charges['gst_percent'] / 100)
        registration = base_price * (charges['registration_percent'] / 100)
        property_tax = base_price * (charges['property_tax_percent'] / 100)
        total_price = base_price + gst + registration + property_tax

        # Step 4: Return breakdown
        return jsonify({
            "property_id": property_id,
            "location": location,
            "base_price": base_price,
            "gst": round(gst, 2),
            "registration": round(registration, 2),
            "property_tax": round(property_tax, 2),
            "total_price": round(total_price, 2)
        })

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Run the Flask app
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)
