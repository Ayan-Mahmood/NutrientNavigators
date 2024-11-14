import unittest
from flask import Flask
from unittest.mock import patch, MagicMock
from allow_users import allow_users

class TestAllowUsers(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)       
        self.app.register_blueprint(allow_users)
        self.client = self.app.test_client()
 

   
    def test_share_logs_success(self):
      
        response = self.client.post('/share_logs', json={
            'user_id': 1,
            'email': "example@email.com"
        })        
        response_code = response.status_code
        self.assertTrue(response_code == 201)

if __name__ == '__main__':
    unittest.main()