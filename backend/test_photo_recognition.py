import unittest
from flask import Flask
from photo_recognition import photo_recognition
from unittest.mock import patch, MagicMock
from io import BytesIO

class TestPhotoRecognition(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(photo_recognition)
        self.client = self.app.test_client()
    
    @patch('photo_recognition.requests.post')
    def test_recognize_food_success(self, mock_post):
        # tests if an image is properly uploaded and taken into the backend
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "outputs": [{
                "data": {
                    "concepts": [
                        {"name": "apple", "value": 0.95},
                        {"name": "banana", "value": 0.90}
                    ]
                }
            }]
        }
        mock_post.return_value = mock_response
        
        image_data = BytesIO(b'mock image data')
        image_data.seek(0)

        response = self.client.post('/recognize_food', data={'image': (image_data, 'test.jpg')})

        self.assertEqual(response.status_code, 200)
        self.assertIn("recognized_food", response.get_json())
        self.assertEqual(len(response.get_json()["recognized_food"]), 2)
        self.assertEqual(response.get_json()["recognized_food"][0]["name"], "apple")

    # test to see if there is no image file uploaded
    def test_recognize_food_no_image(self):
        response = self.client.post('/recognize_food')

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())
        self.assertEqual(response.get_json()["error"], "No image file provided")


if __name__ == '__main__':
    unittest.main()