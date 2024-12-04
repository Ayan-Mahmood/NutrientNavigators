import unittest
from flask import Flask
from unittest.mock import patch, MagicMock
from allow_users import allow_users
import json

class TestAllowUsers(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)       
        self.app.register_blueprint(allow_users)
        self.client = self.app.test_client()
 

   
    def test_share_logs_success(self):
      
        response = self.client.post('/share_logs', json={
            'user_id': 3,
            'email': "example@email.com"
        })        
        response_code = response.status_code
        self.assertTrue(response_code == 201)


    def test_get_list(self):
        response = self.client.get('/get-list?user_id=3')
        data = json.loads(response.data)
        emails = data[1]
       
        self.assertTrue(len(emails) >=1)


    def test_remove_access(self):
        response = self.client.get('/get-list?user_id=3')
        data = json.loads(response.data)
        emails = data[1]

        response = self.client.get('/remove-access?user_id=3&email=example@email.com')
        remove_data = json.loads(response.data)
        remove_emails = remove_data[1]
       
        self.assertTrue(len(emails) > len(remove_emails))

if __name__ == '__main__':
    unittest.main()