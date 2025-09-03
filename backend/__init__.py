from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize MongoDB
client = MongoClient(app.config['MONGODB_URI'])
db = client.get_database()

# Import routes after app is created to avoid circular imports
from . import routes

if __name__ == '__main__':
    app.run(debug=True, port=5000)
