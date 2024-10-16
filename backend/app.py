from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

db_config = {
    'host': 'localhost',  # Replace with MySQL host
    'user': 'your_mysql_user',  # Replace with MySQL username
    'password': 'your_mysql_password',  # Replace with  MySQL password
    'database': 'your_database'  # Replace with MySQL database name
}

def get_db_connection():
    """Establish a connection to the MySQL database."""
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return connection

@app.route('/getmessage', methods=['GET'])
def get_message():
    return jsonify({'message': 'Hello World testing 123!'})

@app.route('/register', methods=['POST'])
def register():
    connection = get_db_connection()
    cursor = connection.cursor()
    
    #extract data from request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    #check if email alreadt in database
    cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        return jsonify({'error': 'User already exists!'})
    
    #hash password
    hashed_password = generate_password_hash(password)
    
    #insert user into database
    try:
        cursor.execute(
            "INSERT INTO user (email, password) VALUES (%s, %s)",
            (email, hashed_password)
        )
        connection.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
    
    
@app.route('/login', methods=['POST'])
def login():
    """Login a user by checking their email and password."""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Extract data from the request body
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if user exists in the database
        cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            # Verify the password
            stored_password = user[2]  # Assuming password is the second column in the user table
            if check_password_hash(stored_password, password):
                return jsonify({"message": "Login successful!"}), 200
            else:
                return jsonify({"error": "Invalid password!"}), 401
        else:
            return jsonify({"error": "User not found!"}), 404
    
    except Error as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()    
    
    
    
if __name__ == '__main__':
    app.run(debug=True)
