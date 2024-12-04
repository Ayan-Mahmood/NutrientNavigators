import mysql.connector
from mysql.connector import Error
from datetime import datetime

# Database configuration (move it to config.py if preferred)
db_config = {
    'host': 'mysql5050.site4now.net',
    'user': 'a3e518_dietana',
    'password': 'Nov142024',
    'database': 'db_a3e518_dietana'
}

def get_db_connection():
    """Establish a connection to the MySQL database."""
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return connection

def LogMeal(selected_items, user_id):
    """
    Creates a meal entry for the user and returns the meal ID.
    """
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}

    try:
        cursor = connection.cursor()
        
        # Insert a new meal entry into the UserMeals table
        insert_meal_query = """
        INSERT INTO UserMeals (MealDate, UserId) 
        VALUES (%s, %s)
        """
        current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(insert_meal_query, (current_datetime, user_id))
        connection.commit()
        
        # Get the ID of the inserted meal
        meal_id = cursor.lastrowid
        
        # Log each selected item with its nutrition data
        for item in selected_items:
            LogItem(item, meal_id)

        return {"success": True, "meal_id": meal_id}
    
    except Error as e:
        print(f"Error creating meal entry: {e}")
        return {"error": str(e)}
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def LogItem(nutrition_data, meal_id):
    """
    Logs nutrition data (Protein, Carbohydrates, Fat) for a specific meal.
    """
    connection = get_db_connection()
    if connection is None:
        return {"error": "Database connection failed"}

    try:
        cursor = connection.cursor()
        
        # Insert nutrition data into the LogItems table
        insert_log_query = """
        INSERT INTO LogItems (UserMealID, Protein, Carbohydrates, Fat) 
        VALUES (%s, %s, %s, %s)
        """
        protein = nutrition_data.get('protein', 0)
        carbohydrates = nutrition_data.get('carbohydrates', 0)
        fat = nutrition_data.get('fat', 0)

        cursor.execute(insert_log_query, (meal_id, protein, carbohydrates, fat))
        connection.commit()

        return {"success": True, "log_id": cursor.lastrowid}
    
    except Error as e:
        print(f"Error logging nutrition data: {e}")
        return {"error": str(e)}
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()