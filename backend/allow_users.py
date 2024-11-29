
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from mysql.connector import Error
import mysql.connector

allow_users= Blueprint("allow_users", __name__)
CORS(allow_users)

db_config = {
    'host': 'sql5.freemysqlhosting.net',
    'user': 'sql5741512',
    'password': 'cdq3bvxp1c',
    'database': 'sql5741512'
}

def get_db_connection():
    """Establish a connection to the MySQL database."""
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return connection



@allow_users.route('/share_logs', methods=['POST'])
def share_logs():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    cursor = connection.cursor()
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        email = data.get('email')

        cursor.execute(
            "INSERT INTO  UserAllowList (UserId, AllowedEmail) values (%s,%s)", (user_id, email)
        )
        connection.commit()
        return jsonify({"success": True, "message": "User successfully added to share list!", "id": user_id}), 201

    
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@allow_users.route('/get-list', methods=['GET'])
def get_list():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    cursor = connection.cursor()
    try:
        data = request.args
        user_id = data.get('user_id')
        shared_list = cursor.execute("Select email FROM UserAllowList Where user_id = %s", (user_id))
        return jsonify({"success": True, "user_profile": shared_list}), 200
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
