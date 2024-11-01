import unittest
from unittest.mock import patch, MagicMock
from app import app 
from werkzeug.security import generate_password_hash

class TestFlaskAPI(unittest.TestCase):
    def setUp(self):
        """Set up the test client."""
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.get_db_connection')
    def test_register_success(self, mock_db):
        """Test successful user registration."""
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_db.return_value = mock_conn

       
        mock_cursor.fetchone.return_value = None

        response = self.app.post('/register', json={
            'email': 'test@example.com',
            'password': 'securepassword'
        })

        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'User registered successfully!')

    @patch('app.get_db_connection')
    def test_login_success(self, mock_db):
        """Test successful login."""
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_db.return_value = mock_conn

        
        hashed_password = generate_password_hash('securepassword')
        mock_cursor.fetchone.return_value = (1, 'test@example.com', hashed_password)

        response = self.app.post('/login', json={
            'email': 'test@example.com',
            'password': 'securepassword'
        })

        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'Login successful!')

if __name__ == '__main__':
    unittest.main()