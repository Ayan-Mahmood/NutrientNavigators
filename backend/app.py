from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash
from photo_recognition import photo_recognition
from allow_users import allow_users
from set_nutrition_goals import set_nutrition

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://nasty-crypt-xgr6rqp6r4v3xpr-19006.app.github.dev"}})
#CORS(app, resources={r"/*": {"origins": "http://localhost:19006"}})
# Register the Blueprint with an optional URL prefix
app.register_blueprint(photo_recognition)
app.register_blueprint(set_nutrition)
app.register_blueprint(allow_users)

db_config = {
    'host': 'mysql5050.site4now.net',  # Your MySQL host
    'user': 'a3e518_dietana',  # Your MySQL username
    'password': 'Nov142024',  # Your MySQL password
    'database': 'db_a3e518_dietana'  # Your MySQL database name
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
        user_id = cursor.lastrowid
        connection.commit()
        return jsonify({"success": True, "message": "User registered successfully!", "id": user_id}), 201
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
                return jsonify({"success": True, "message": "Login successful!", "id": user[0]}), 200
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

@app.route('/get_user_profile', methods=['GET'])
def get_user_profile():
    """Fetch user profile data based on user ID."""
    # Get the user ID from the query parameters
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"success": False, "error": "User ID is required"}), 400

    # Connect to the database
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    cursor = connection.cursor(dictionary=True)  # Use dictionary=True for column names in results

    try:
        # Query the database for the user's profile data
        cursor.execute("SELECT name, age, biological_sex, height, weight, goal FROM user_profile WHERE user_id = %s", (user_id,))
        user_profile = cursor.fetchone()
        user_profile["id"] = user_id
        # If no user is found with the given ID
        if user_profile is None:
            return jsonify({"success": False, "error": "User not found"}), 404

        return jsonify({"success": True, "user_profile": user_profile}), 200

    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()


if __name__ == '__main__':
     app.run(debug=True)
