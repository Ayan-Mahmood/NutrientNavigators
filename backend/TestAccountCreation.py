import unittest
from unittest.mock import patch, MagicMock
from app import register  
from flask import Flask, jsonify, request

app = Flask(__name__)

class TestAccountCreation(unittest.TestCase):

    @patch('app.get_db_connection')
    @patch('app.request')
    def test_register_user_success(self, mock_request, mock_get_db_connection):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_request.get_json.return_value = {'email': 'noone@stevens.edu', 'password': 'password123'}

        mock_cursor.fetchone.return_value = None

        with app.test_request_context():
            response = register()
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['success'], True)
        self.assertEqual(response.json['message'], 'User registered successfully!')

    @patch('app.get_db_connection')
    @patch('app.request')
    def test_register_user_exists(self, mock_request, mock_get_db_connection):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_request.get_json.return_value = {'email': 'eliu8@stevens.edu', 'password': 'password123'}

        mock_cursor.fetchone.return_value = {'email': 'eliu8@stevens.edu'}

        with app.test_request_context():
            response = register()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['success'], False)
        self.assertEqual(response.json['error'], 'User already exists!')

    @patch('app.get_db_connection')
    def test_register_db_connection_fail(self, mock_get_db_connection):
        mock_get_db_connection.return_value = None

        with app.test_request_context():
            response = register()

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json['success'], False)
        self.assertEqual(response.json['error'], 'Database connection failed')


if __name__ == '__main__':
    unittest.main()
