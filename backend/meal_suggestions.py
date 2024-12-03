from flask import Blueprint, request, jsonify
import openai

meal_suggestions = Blueprint("meal_suggestions", __name__)

# Set OpenAI API key
# REPLACE SECRET_KEY WITH THE MOST RECENT KEY I SENT, BUT DO NOT UPLOAD ANY CODE WITH THE SECRET_KEY PRESENT OR ELSE A NEW ONE NEEDS TO BE MADE
openai.api_key = "SECRET_KEY"

def get_meal_recommendations(goal, preferred_diet, age, weight, height, activity_level, weekly_workouts, macro_choice, carbs, fats, protein):
    # Extract relevant fields from the user profile


    # Create a more detailed prompt for meal suggestions
    prompt = (
        f"Generate a personalized meal plan for a {age}-year-old, {weight} individual with a height of {height}. "
        f"The goal is to {goal.lower()}. Preferred diet is {preferred_diet}. "
        f"The user has an activity level of {activity_level} with {weekly_workouts} weekly workouts. "
        f"The macro distribution is {carbs}% carbs, {fats}% fats, and {protein}% protein. "
        f"Please suggest meals for breakfast, lunch, dinner, and snacks."
    )

    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful nutritionist."},
                {"role": "user", "content": prompt}
            ]
        )
        meal_plan = response.choices[0].message.content
        meals = meal_plan.split('\n')
        return meals
    except Exception as e:
        return f"Error fetching meal suggestions: {str(e)}"

@meal_suggestions.route('/suggest_meals', methods=['POST'])
def suggest_meals():
    data = request.get_json()
    print(data)  # Debugging

    # Validate input
    if not data or not data.get('goal') or not data.get('preferred_diet') or not data.get('age') or not data.get('weight') or not data.get('height') or not data.get('activity_level') or not data.get('weekly_workouts') or not data.get('macro_choice') or not data.get('carbs') or not data.get('fats') or not data.get('protein'):
        return jsonify({'success': False, 'error': 'Invalid input'}), 400

    user_goal = data['goal']
    user_diet = data['preferred_diet']
    user_age = data['age']
    user_weight = data['weight']
    user_height = data['height']
    user_activity_level = data['activity_level']
    user_weekly_workouts = data['weekly_workouts']
    user_macro_choice = data['macro_choice']
    user_carbs= data['carbs']
    user_fats = data['fats']
    user_protein = data['protein']

    try:
        meal_suggestions = get_meal_recommendations(user_goal, user_diet, user_age, user_weight, user_height, user_activity_level, user_weekly_workouts, user_macro_choice, user_carbs, user_fats, user_protein)
        return jsonify({
            'success': True,
            'message': "Meal suggestions generated successfully",
            'meals': meal_suggestions
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': meal_suggestions
        }), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500