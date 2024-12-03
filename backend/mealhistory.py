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
        
@meal_history.route('/save_log', methods=['POST'])
def save_meal_log():
    try:
        # Parse request data
        user_id = request.json.get("user_id")
        food_log = request.json.get("foodLog", [])

        if not user_id or not food_log:
            return jsonify({"error": "User ID and food log are required."}), 400

        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500

        cursor = connection.cursor()
        
        # Prepare SQL query
        query = """
        INSERT INTO meal_logs (user_id, meal_name, date_logged, calories, protein, fat, carbohydrates)
        VALUES (%s, %s, NOW(), %s, %s, %s, %s)
        """
        
        # Insert each food item into the database
        for meal in food_log:
            cursor.execute(query, (
                user_id,
                meal.get("name"),
                meal.get("calories", 0),  # Default to 0 if value is missing
                meal.get("protein", 0),
                meal.get("fat", 0),
                meal.get("carbohydrates", 0),
            ))
        
        # Commit the transaction
        connection.commit()
        
        return jsonify({"message": "Meal log saved successfully"}), 200
    
    except Error as e:
        print(f"Error saving meal log: {e}")
        return jsonify({"error": "Failed to save meal log"}), 500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

# if __name__ == '__main__':
#     get_meal_history.run(debug=True)
