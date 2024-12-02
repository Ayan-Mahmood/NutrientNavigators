from flask import Blueprint, request, jsonify
from mysql.connector import Error
import mysql.connector

daily_summary = Blueprint("daily_summary", __name__)

# Database Configuration
db_config = {
    'host': 'mysql5050.site4now.net',  # Your MySQL host
    'user': 'a3e518_dietana',  # Your MySQL username
    'password': 'Nov142024',  # Your MySQL password
    'database': 'db_a3e518_dietana'  # Your MySQL database name
}

def get_db_connection():
    """Establish a connection to the MySQL database."""
    try:
        return mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@daily_summary.route('/daily_summary', methods=['GET'])
def get_daily_summary():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500

    user_id = request.args.get('user_id')
    date = request.args.get('date')

    if not user_id or not date:
        return jsonify({"success": False, "error": "Missing required parameters"}), 400

    try:
        cursor = connection.cursor(dictionary=True)
        
        # Fetch logged meals for the day
        cursor.execute("""
            SELECT name, calories, protein, carbs, fat
            FROM meals
            WHERE user_id = %s AND DATE(logged_at) = %s
        """, (user_id, date))
        meals = cursor.fetchall()

        if not meals:
            return jsonify({"success": True, "summary": {"meals": [], "totalCalories": 0, "totalProtein": 0, "totalCarbs": 0, "totalFat": 0}})

        # Calculate totals
        total_calories = sum(meal['calories'] for meal in meals)
        total_protein = sum(meal['protein'] for meal in meals)
        total_carbs = sum(meal['carbs'] for meal in meals)
        total_fat = sum(meal['fat'] for meal in meals)

        # Fetch user goals
        cursor.execute("""
            SELECT goal, protein, carbs, fats
            FROM user_profile
            WHERE user_id = %s
        """, (user_id,))
        goals = cursor.fetchone()

        summary = {
            "meals": meals,
            "totalCalories": total_calories,
            "totalProtein": total_protein,
            "totalCarbs": total_carbs,
            "totalFat": total_fat,
            "goalProtein": goals.get("protein") if goals else None,
            "goalCarbs": goals.get("carbs") if goals else None,
            "goalFats": goals.get("fats") if goals else None,
        }

        return jsonify({"success": True, "summary": summary})

    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
