# photo_recognition.py
from flask import Blueprint, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import requests
import base64

photo_recognition = Blueprint("photo_recognition", __name__)
CORS(photo_recognition)

# Clarifai API credentials (starter code given by Clarifai when using the API and not using it on an app on the website)
PAT = 'fe940b734e624ecd8b639f32e6e45fe3'
USER_ID = 'clarifai'
APP_ID = 'main'
MODEL_ID = 'food-item-recognition'
MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'
CLARIFAI_URL = f"https://api.clarifai.com/v2/models/{MODEL_ID}/versions/{MODEL_VERSION_ID}/outputs"

# USDA API Configuration
USDA_API_KEY = 'wS0NDbmfrOpcZDzyrgjkUY0lWhNSQB5ggkEzZhzT'
USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

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

# recognizes the food by connecting to the Clarifai food-recognition-api
@photo_recognition.route('/recognize_food', methods=['POST'])
def recognize_food():
    print("Request headers:", request.headers)
    print("Request form:", request.form)
    print("Request files:", request.files)

    image_file = request.files.get('image')
    if not image_file:
        print("No image file received.")
        return jsonify({"error": "No image file provided"}), 400

    # reading the file in base64 as we had seen a previous example of doing so for image encoding
    image_bytes = image_file.read()
    base64_image = base64.b64encode(image_bytes).decode('utf-8')

    headers = {
        'Authorization': f'Key {PAT}',
        'Content-Type': 'application/json'
    }

    # create the data that will be used for the Clarifai
    data = {
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": base64_image
                    }
                }
            }
        ]
    }

    try:
        # create a POST request to Clarifai API
        response = requests.post(CLARIFAI_URL, headers=headers, json=data)
        response_data = response.json()

        # error checking to see if it is successful
        if response.status_code != 200 or 'outputs' not in response_data:
            print(f"Clarifai API error: {response_data}")
            return jsonify({"error": "Failed to process image"}), 500

        # acquire the food items and level of confidence pertaining to each food item
        food_items = [
            {"name": concept["name"], "confidence": concept["value"]}
            for concept in response_data['outputs'][0]['data']['concepts']
        ]

        return jsonify({"recognized_food": food_items}), 200

    except Exception as e:
        print(f"Error recognizing food: {e}")
        return jsonify({"error": "Failed to recognize food"}), 500

# option for the user to override the food and input what the food actually is
@photo_recognition.route('/override_food', methods=['POST'])
def override_food():
    data = request.get_json()
    original_food = data.get('original_food')
    overridden_food = data.get('overridden_food')
    user_id = data.get('user_id')

    if not original_food or not overridden_food:
        return jsonify({"error": "Original and overridden food names are required"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO food_overrides (user_id, original_food, overridden_food) VALUES (%s, %s, %s)",
            (user_id, original_food, overridden_food)
        )
        connection.commit()
        return jsonify({"message": "Food override saved successfully"}), 201
    except Error as e:
        print(f"Error saving override: {e}")
        return jsonify({"error": "Failed to save override"}), 500
    finally:
        cursor.close()
        connection.close()


# Route for providing nutritional data for a hardcoded food item (e.g., pizza)
@photo_recognition.route('/get_nutritional_data', methods=['GET'])
def get_nutritional_data():
    food_item = "pizza"

    # Prepare the request to the USDA FoodData Central API
    params = {
        "query": food_item,
        "pageSize": 1,
        "api_key": USDA_API_KEY
    }

    try:
        response = requests.get(USDA_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # Extract specific nutritional information if available
        if data and data.get("foods"):
            food_data = data["foods"][0]
            nutrients = {
                "description": food_data.get("description"),
                "calories": next((nutrient["value"] for nutrient in food_data["foodNutrients"] if nutrient["nutrientName"] == "Energy"), "N/A"),
                "protein": next((nutrient["value"] for nutrient in food_data["foodNutrients"] if nutrient["nutrientName"] == "Protein"), "N/A"),
                "fat": next((nutrient["value"] for nutrient in food_data["foodNutrients"] if nutrient["nutrientName"] == "Total lipid (fat)"), "N/A"),
                "carbohydrates": next((nutrient["value"] for nutrient in food_data["foodNutrients"] if nutrient["nutrientName"] == "Carbohydrate, by difference"), "N/A")
            }
            return jsonify({"food": nutrients}), 200
        else:
            return jsonify({"error": "No data found for the given food item"}), 404

    except requests.RequestException as e:
        print(f"Error fetching data from USDA API: {e}")
        return jsonify({"error": "Failed to fetch nutritional data"}), 500

