from flask import request
from flask_restful import Resource
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import app, db, api
from models import User

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

# Routes for Users
@app.route('/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        users = User.query.all()
        users_json = [
            {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'notes': user.notes,
                'phone_number': user.phone_number,
                'email': user.email,
                'date': user.date,
                'date_time': user.date_time,
                'user_id': user.user_id,
                'guest_id': user.guest_id,
              'menu_id': user.menu_id,
            }
            for user in users
        ]
        return jsonify(users_json)
    elif request.method == 'POST':
        data = request.json
        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            notes=data['notes'],
            phone_number=data['phone_number'],
            email=data['email'],
            date=data['date'],
            date_time=data['date_time'],
            user_id=data['user_id'],
            guest_id=data['guest_id'],
            menu_id=data['menu_id'],
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'Method not allowed'}), 405
    

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Initialize JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key
jwt = JWTManager(app)

# Routes for User Authentication
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    # Validate username and password
    # Example: check against database or other authentication method
    if data['username'] == 'admin' and data['password'] == 'admin_password':
        access_token = create_access_token(identity=data['username'])
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)