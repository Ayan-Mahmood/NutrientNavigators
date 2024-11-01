import unittest
from unittest.mock import patch, MagicMock
from app import login
from flask import jsonify

class TestLogin(unittest.TestCase):

    @patch('app.get_db_connection')
    @patch('app.request')
    def test_login_success(self, mock_request, mock_get_db_connection):
        mock_request.get_json.return_value = {'email': 'eliu8@stevens.edu', 'password': 'nutrientnavigators555'}

        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = (1, 'eliu8@stevens.edu', 'hashed_password')

        with patch('app.check_password_hash') as mock_check_password_hash:
            mock_check_password_hash.return_value = True

            response = login()

            self.assertEqual(response[1], 200)
            self.assertEqual(response[0].json['success'], True)
            self.assertEqual(response[0].json['message'], 'Login successful!')

    @patch('app.get_db_connection')
    @patch('app.request')
    def test_login_user_not_found(self, mock_request, mock_get_db_connection):
        mock_request.get_json.return_value = {'email': 'noone@stevens.edu', 'password': 'fake123'}

        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = None

        response = login()

        self.assertEqual(response[1], 404)
        self.assertEqual(response[0].json['success'], False)
        self.assertEqual(response[0].json['error'], 'User not found!')

if __name__ == '__main__':
    unittest.main()
