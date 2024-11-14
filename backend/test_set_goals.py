import pytest
from set_nutrition_goals.py import app

def test_set_goals_success(client):
    response = client.post("/set_goals", json={
        "user_id": 1,
        "name": "John Doe",
        "age": 30,
        "biological_sex": "male",
        "height": "6ft",
        "weight": "180lbs",
        "goal": "Build muscle",
        "preferred_diet": "Standard",
        "macro_choice": "Standard",
        "daily_meals": 3,
        "activity_level": "Moderate",
        "weekly_workouts": "Moderate"
    })
    assert response.status_code == 201
    assert response.json["success"] is True
    assert response.json["message"] == "Your Results"
