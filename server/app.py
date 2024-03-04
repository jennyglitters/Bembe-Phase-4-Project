from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import Users  # Assuming Users model is imported from models.py
from config import app, db
from flask_migrate import Migrate
from flask_restful import Api


# Instantiate Flask app
app.config.from_object(Config)

# Initialize CORS
CORS(app)

# Initialize SQLAlchemy

migrate = Migrate(app, db)

# Initialize REST API
api = Api(app)


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'your_database_uri'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize Flask-JWT-Extended
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
jwt = JWTManager(app)


# Routes for Users
@app.route('/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        users = Users.query.all()
        users_json = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.user_email
            }
            for user in users
        ]
        return jsonify(users_json), 200
    elif request.method == 'POST':
        data = request.json
        new_user = Users(
            username=data.get('username'),
            user_email=data.get('email'),
            passwordhash=data.get('password')  # Assuming you're storing password hash in 'passwordhash' field
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'Method not allowed'}), 405


# Route for User Authentication
@app.route('/users/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Query the database to find a user with the provided username
    user = Users.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # If the user exists and the password matches, create an access token
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


if __name__ == '__main__':
    from models import *
    app.run(debug=True, port=5555)
