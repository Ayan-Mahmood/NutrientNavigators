import unittest
from app import app

class TestFlaskAPI(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_set_goals_success(self):
        response = self.client.post("/set_goals", json={
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
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["success"])
        self.assertEqual(response.json["message"], "Your Results")

if __name__ == '__main__':
    unittest.main()