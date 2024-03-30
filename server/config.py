from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta

class Config:
    # Flask app configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///bembe.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSONIFY_PRETTYPRINT_REGULAR = False

    # Secret keys for JWT
    SECRET_KEY = 'your-secret-key'
    JWT_SECRET_KEY = 'your-jwt-secret-key'

    # JWT access token expiration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

app = Flask(__name__)
app.config.from_object(Config)

# Initialize SQLAlchemy and JWTManager extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)