from flask import jsonify, request
from . import app, db

@app.route('/api/test', methods=['GET'])
def test_connection():
    try:
        # Test the MongoDB connection
        db.command('ping')
        return jsonify({
            'status': 'success',
            'message': 'Successfully connected to MongoDB!',
            'collections': db.list_collection_names()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to connect to MongoDB: {str(e)}'
        }), 500

# Add more routes here as needed
