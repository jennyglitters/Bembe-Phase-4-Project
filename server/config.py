#config.py
from flask import Flask
from flask_cors import CORS
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from flask_jwt_extended import JWTManager, create_access_token
from flask_restful import Api
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

# Instantiate CORS
class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key'