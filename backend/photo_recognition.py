from flask import Flask, request, jsonify
from flask_cors import CORS
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
import base64
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

# Clarifai API credentials
USER_ID = 'd30m17xwreuq'
PAT = 'fe940b734e624ecd8b639f32e6e45fe3'
APP_ID = 'main'
WORKFLOW_ID = 'Food'

# MySQL configuration for storing overrides
db_config = {
    'host': 'nutrientnavigatorsdb.cf2osw08aov0.us-east-1.rds.amazonaws.com',  # Replace with your MySQL host
    'user': 'admin',  # Replace with your MySQL username
    'password': 'nutrientnavigators555',  # Replace with your MySQL password
    'database': 'NutrientNavigatorsDB'  # Replace with your MySQL database name
}

# Set up the Clarifai gRPC connection
channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)
metadata = (('authorization', 'Key ' + PAT),)
userDataObject = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)

def get_db_connection():
    """Establish a connection to the MySQL database."""
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return connection


@app.route('/recognize_food', methods=['POST'])
def recognize_food():
    # Get the image file from the request
    image_file = request.files.get('image')
    if not image_file:
        return jsonify({"error": "No image file provided"}), 400

    # Read the image and encode it to base64
    image_data = base64.b64encode(image_file.read()).decode('utf-8')

    # Call Clarifai API to recognize food in the image using the gRPC workflow
    try:
        post_workflow_results_response = stub.PostWorkflowResults(
            service_pb2.PostWorkflowResultsRequest(
                user_app_id=userDataObject,
                workflow_id=WORKFLOW_ID,
                inputs=[
                    resources_pb2.Input(
                        data=resources_pb2.Data(
                            image=resources_pb2.Image(
                                base64=image_data
                            )
                        )
                    )
                ]
            ),
            metadata=metadata
        )

        if post_workflow_results_response.status.code != status_code_pb2.SUCCESS:
            print(post_workflow_results_response.status)
            return jsonify({"error": "Failed to process image"}), 500

        # Process results
        results = post_workflow_results_response.results[0]
        food_items = []
        for output in results.outputs:
            for concept in output.data.concepts:
                food_items.append({"name": concept.name, "confidence": concept.value})

        return jsonify({"recognized_food": food_items}), 200

    except Exception as e:
        print(f"Error recognizing food: {e}")
        return jsonify({"error": "Failed to recognize food"}), 500



@app.route('/override_food', methods=['POST'])
def override_food():
    # Extract the data from the request
    data = request.get_json()
    original_food = data.get('original_food')
    overridden_food = data.get('overridden_food')
    user_id = data.get('user_id')  # Optionally store with user ID

    # Check if the required data is provided
    if not original_food or not overridden_food:
        return jsonify({"error": "Original and overridden food names are required"}), 400

    # Store the overridden item in the database
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

if __name__ == '__main__':
    app.run(debug=True)
