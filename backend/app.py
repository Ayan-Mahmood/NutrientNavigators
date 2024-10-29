from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

db_config = {
    'host': 'sql5.freemysqlhosting.net',  # Your MySQL host
    'user': 'sql5741512',  # Your MySQL username
    'password': 'cdq3bvxp1c',  # Your MySQL password
    'database': 'sql5741512'  # Your MySQL database name
}


def get_db_connection():
    """Establish a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database']
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/getmessage', methods=['GET'])
def get_message():
    return jsonify({'message': 'Hello World testing 123!'})

@app.route('/register', methods=['POST'])
def register():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    cursor = connection.cursor()

    try:
        # Extract data from request
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if email already in database
        cursor.execute('SELECT * FROM Users WHERE email = %s', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'success': False, 'error': 'User already exists!'}), 400

        # Hash password
        hashed_password = generate_password_hash(password)

        # Insert user into database
        cursor.execute(
            "INSERT INTO Users (email, password) VALUES (%s, %s)",
            (email, password)
        )
        connection.commit()
        return jsonify({"success": True, "message": "User registered successfully!"}), 201
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()

@app.route('/login', methods=['POST'])
def login():
    """Login a user by checking their email and password."""
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    cursor = connection.cursor()

    try:
        # Extract data from the request body
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if user exists in the database
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            # Verify the password
            print(user[2])
            print(password)
            stored_password = user[2]  # Assuming password is the third column in the user table)
            if (password == stored_password):
                return jsonify({"success": True, "message": "Login successful!"}), 200
            else:
                return jsonify({"success": False, "error": "Invalid password!"}), 401
        else:
            return jsonify({"success": False, "error": "User not found!"}), 404

    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
