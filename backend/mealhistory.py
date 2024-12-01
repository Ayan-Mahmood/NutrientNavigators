from flask import Blueprint, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

meal_history = Blueprint("meal_history", __name__)
CORS(meal_history)

db_config = {
    'host': 'mysql5050.site4now.net',
    'user': 'a3e518_dietana',
    'password': 'Nov142024',
    'database': 'db_a3e518_dietana'
}

def get_db_connection():
    """Establish a connection to the MySQL database."""
    try:
        return mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@meal_history.route('/meal_history', methods=['GET'])
def get_meal_history():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    cursor = connection.cursor(dictionary=True)
    try:
        query = """
        SELECT meal_id, user_id, meal_name, date_logged, calories, protein, fat, carbohydrates
        FROM meal_logs
        WHERE user_id = %s
        ORDER BY date_logged DESC
        """
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()

        if not result:
            return jsonify({"message": "No meal history found for the user"}), 404

        return jsonify({"meal_history": result}), 200
    except Error as e:
        print(f"Error fetching meal history: {e}")
        return jsonify({"error": "Failed to fetch meal history"}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    get_meal_history.run(debug=True)
