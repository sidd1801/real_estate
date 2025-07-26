from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# -----------------------------
# Reset DB from SQL file
# -----------------------------
def reset_database():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Siddhant@18012003"
        )
        cursor = conn.cursor()

        with open('real_estate_db.sql', 'r', encoding='utf-8') as f:
            sql_commands = f.read()

        for command in sql_commands.split(';'):
            cmd = command.strip()
            if cmd:
                try:
                    cursor.execute(cmd)
                except mysql.connector.Error as err:
                    print(f"❌ Error in: {cmd}\n{err}")

        conn.commit()
        cursor.close()
        conn.close()
        return True
    except mysql.connector.Error as err:
        print(f"❌ DB reset error: {err}")
        return False

# -----------------------------
# Database connection
# -----------------------------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Siddhant@18012003",
    database="real_estate_db"
)
cursor = db.cursor(dictionary=True)

# -----------------------------
# Table mapping
# -----------------------------
TABLES = {
    "users": "Users",
    "agents": "Agents",
    "properties": "Properties",
    "soldproperties": "SoldProperties",
    "unsoldproperties": "UnsoldProperties",
    "rentproperties": "RentProperties"
}

# -----------------------------
# Fetch table attributes
# -----------------------------
@app.route('/api/attributes', methods=['GET'])
def get_table_attributes():
    table = request.args.get('table')
    if table not in TABLES:
        return jsonify({"error": "Invalid table"}), 400

    cursor.execute(f"DESCRIBE {TABLES[table]}")
    attributes = [row["Field"] for row in cursor.fetchall()]
    return jsonify(attributes)

# -----------------------------
# Fetch data (with optional filters)
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
        return jsonify(cursor.fetchall())
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Insert data
# -----------------------------
@app.route('/api/insert', methods=['POST'])
def insert_data():
    data = request.json
    table = data.get("table")
    record = data.get("data")

    if not table or not record or table not in TABLES:
        return jsonify({"error": "Invalid table or data"}), 400

    try:
        columns = ", ".join(record.keys())
        placeholders = ", ".join(["%s"] * len(record))
        values = tuple(record.values())

        query = f"INSERT INTO {TABLES[table]} ({columns}) VALUES ({placeholders})"
        cursor.execute(query, values)
        db.commit()

        return jsonify({"message": "Record inserted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


# -----------------------------
# Update data
# -----------------------------
@app.route('/api/update', methods=['PUT'])
def update_data():
    data = request.json
    table = data.get("table")
    filters = data.get("filters")
    updates = data.get("updates")

    if not table or not filters or not updates or table not in TABLES:
        return jsonify({"error": "Missing table, filters, or updates"}), 400

    try:
        set_clause = ", ".join([f"{col} = %s" for col in updates])
        where_clause = " AND ".join([f"{col} = %s" for col in filters])
        values = tuple(updates.values()) + tuple(filters.values())

        query = f"UPDATE {TABLES[table]} SET {set_clause} WHERE {where_clause}"
        cursor.execute(query, values)
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No record updated"}), 404
        return jsonify({"message": f"{cursor.rowcount} record(s) updated"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


# -----------------------------
# Delete data
# -----------------------------
@app.route('/api/delete', methods=['DELETE'])
def delete_data():
    data = request.json
    table = data.get("table")
    filter_column = data.get("filter_column")
    filter_value = data.get("filter_value")

    if not table or not filter_column or filter_value is None or table not in TABLES:
        return jsonify({"error": "Invalid delete parameters"}), 400

    try:
        query = f"DELETE FROM {TABLES[table]} WHERE {filter_column} = %s"
        cursor.execute(query, (filter_value,))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No record deleted"}), 404
        return jsonify({"message": "Record deleted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


# -----------------------------
# Automatic price calculation
# -----------------------------
@app.route('/api/calculate-price/<int:property_id>', methods=['GET'])
def calculate_property_price(property_id):
    try:
        cursor.execute("SELECT * FROM Properties WHERE id = %s", (property_id,))
        property_data = cursor.fetchone()

        if not property_data:
            return jsonify({"error": "Property not found"}), 404

        base_price = property_data.get('price')
        location = property_data.get('location')

        cursor.execute("SELECT * FROM location_charges WHERE location = %s", (location,))
        charges = cursor.fetchone()

        if not charges:
            return jsonify({"error": f"No tax data found for location: {location}"}), 404

        gst = base_price * (charges['gst_percent'] / 100)
        registration = base_price * (charges['registration_percent'] / 100)
        property_tax = base_price * (charges['property_tax_percent'] / 100)
        total_price = base_price + gst + registration + property_tax

        return jsonify({
            "property_id": property_id,
            "location": location,
            "base_price": base_price,
            "gst_percent": charges['gst_percent'],
            "gst": round(gst, 2),
            "registration_percent": charges['registration_percent'],
            "registration": round(registration, 2),
            "property_tax_percent": charges['property_tax_percent'],
            "property_tax": round(property_tax, 2),
            "total_price": round(total_price, 2)
        })
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Manual price calculation
# -----------------------------
@app.route('/api/manual-calculate-price', methods=['POST'])
def manual_calculate_price():
    data = request.json
    property_id = data.get("property_id")
    gst_percent = data.get("gst_percent", 0)
    registration_percent = data.get("registration_percent", 0)
    property_tax_percent = data.get("property_tax_percent", 0)

    try:
        cursor.execute("SELECT price FROM Properties WHERE id = %s", (property_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Property not found"}), 404

        base_price = row["price"]
        gst = base_price * gst_percent / 100
        registration = base_price * registration_percent / 100
        property_tax = base_price * property_tax_percent / 100
        total_price = base_price + gst + registration + property_tax

        return jsonify({
            "base_price": base_price,
            "gst": gst,
            "gst_percent": gst_percent,
            "registration": registration,
            "registration_percent": registration_percent,
            "property_tax": property_tax,
            "property_tax_percent": property_tax_percent,
            "total_price": total_price
        })
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# -----------------------------
# Reset DB endpoint
# -----------------------------
@app.route('/api/reset-db', methods=['POST'])
def api_reset_db():
    success = reset_database()
    if success:
        return jsonify({"message": "Database reset from real_estate_db.sql"}), 200
    else:
        return jsonify({"error": "Database reset failed"}), 500

# -----------------------------
# Run Flask app
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)
