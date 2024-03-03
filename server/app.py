from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import Users
from config import app, db
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)  # Enable Cross-Origin Resource Sharing
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key
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
            username=data['username'],
            user_email=data['email'],
            passwordhash=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'Method not allowed'}), 405

# Route for User Authentication
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # Query the database to find a user with the provided username
    user = Users.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # If the user exists and the password matches, create an access token
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5555)