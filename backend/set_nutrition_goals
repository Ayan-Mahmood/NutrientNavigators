def convert_height_to_cm(height):
    if 'ft' in height:
        parts = height.split('ft')
        feet = int(parts[0].strip())
        inches = int(parts[1].strip().replace('in', '')) if 'in' in parts[1] else 0
        return round(feet * 30.48 + inches * 2.54, 2)
    elif 'cm' in height:
        return float(height.replace('cm', '').strip())

def convert_weight_to_kg(weight):
    if 'lbs' in weight:
        pounds = float(weight.replace('lbs', '').strip())
        return round(pounds * 0.453592, 2)
    elif 'kg' in weight:
        return float(weight.replace('kg', '').strip())

def calculate_standard_macros(goal, diet):
    if goal == "Lose weight":
        return {"protein": 35, "carbs": 25, "fats": 35}
    elif goal == "Build muscle":
        return {"protein": 35, "carbs": 45, "fats": 20}
    elif goal == "Athletic Performance":
        return {"protein": 30, "carbs": 50, "fats": 20}
    elif goal == "Body Recomposition":
        return {"protein": 35, "carbs": 35, "fats": 30}
    elif goal == "Improve Health":
        return {"protein": 30, "carbs": 45, "fats": 25}
    # Add more conditions based on goals and diets
    # numbers need revision
    return {"protein": 30, "carbs": 35, "fats": 35}  # Standard anything diet ratio

@app.route('/set_goals', methods=['POST'])
def set_goals():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"success": False, "error": "Database connection failed"}), 500
    cursor = connection.cursor()

    try:
        data = request.get_json()
        user_id = data.get('user_id') what's our variable for user id?
        age = data.get('age')
        biological_sex = data.get('biological_sex')
            #options: male/female
        height = data.get('height')
            #must have separate fields for ft + in, option for ft+in or cm; set valid entries between 2 and 9 feet
        weight = data.get('weight')
            #set valid entries between 50 and 500 lbs
        goal = data.get('goal')
            #lose weight, build muscle, athletic performance, body recomposition, improve health
        preferred_diet = data.get('preferred_diet')
        macro_choice = data.get('macro_choice')
            #here will be the option to use standard or set custom
        daily_meals = data.get('daily_meals')
            #valid between 1 and 8
        activity_level = data.get('activity_level')
            #"Describe your daily activity"
            #Very light = "Sitting most of the day e.g. desk job"
            #Light = "Mix of sitting, standing, and light activity e.g. teacher"
            #Moderate = "Continuous gentle/moderate activity e.g. restaurant worker"
            #Heavy = "Strenous activity throughout e.g. construction/labor"
        weekly_workouts = data.get('weekly_workouts')
            #"How much do you work out in a week?"
            #Very light = almost none purposeful
            #Light = 1-3 hours gentle
            #Moderate = 3-4 hours moderate
            #Intense = 4-6 hours heavy
            #Very intense = 7+ hours strenuous

        height_cm = convert_height_to_cm(height)
        weight_kg = convert_weight_to_kg(weight)

        if macro_choice == "Standard":
            macros = calculate_standard_macros(goal, diet)
        else:
            macros = {
                "protein": data.get('protein'),
                "carbs": data.get('carbs'),
                "fats": data.get('fats')
            }

        # Enter profile data into database
         cursor.execute("""
            INSERT INTO user_profile 
            (user_id, age, biological_sex, height, weight, goal, preferred_diet, macro_choice, daily_meals, activity_level, weekly_workouts, protein, carbs, fats) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (user_id, age, biological_sex, height, weight, goal, preferred_diet, daily_meals, activity_level, weekly_workouts, macros['protein'], macros['carbs'], macros['fats']))
            #will this create a new user id or enter info into the existing one?
            
        connection.commit()

        return jsonify({"success": True, "message": "Your Results"}), 201
        #show summary of user choices and breakdown of calories and macros needed per day
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
