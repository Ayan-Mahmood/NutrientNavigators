from flask import Flask, jsonify

app = Flask(__name__)

# Create a simple route that returns a JSON response
@app.route('/helloworld', methods=['GET'])
def get_message():
    return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    app.run(debug=True)
    