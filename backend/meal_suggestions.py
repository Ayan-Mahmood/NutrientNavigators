from flask import Blueprint, request, jsonify
import os

import openai

meal_suggestions = Blueprint("meal_suggestions", __name__)
openai.api_key = "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"

def get_meal_recommendations(goal, diet_type):
    prompt = f"Suggest a list of healthy meals for someone who wants to {goal}. Their diet preference is {diet_type}. Include breakfast, lunch, dinner, and snacks."
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )
        meals = response.choices[0].message.content
        return meals
    except Exception as e:
        return f"Error fetching meal suggestions: {str(e)}"

@meal_suggestions.route('/suggest_meals', methods=['POST'])
def suggest_meals():
    data = request.get_json()
    print(data)
    # Handle missing data
    if not data or not data.get('goal') or not data.get('preferred_diet'):
        return jsonify({'success': False, 'error': 'Invalid input'}), 400

    user_goal = data['goal']
    user_diet = data['preferred_diet']

    try:
        meal_suggestions = get_meal_recommendations(user_goal, user_diet)
        return jsonify({
            'success': True,
            'message': "Meal suggestions generated successfully",
            'meals': meal_suggestions
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500