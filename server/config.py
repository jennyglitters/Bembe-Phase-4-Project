#config.py
from flask import Flask
from flask_cors import CORS
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from flask_jwt_extended import JWTManager, create_access_token
from flask_restful import Api
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

# Instantiate CORS
class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///bembe.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key'
    JWT_SECRET_KEY = 'your-jwt-secret-key'  # Add a secret key for JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
#Remember, the SECRET_KEY and JWT_SECRET_KEY should be kept secret and not 
#hardcoded in production. You might want to consider using environment variables to
# manage these sensitive keys securely. For example:

#python
#Copy code
#import os

#class Config:
    #DEBUG = True
    #SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    #SQLALCHEMY_TRACK_MODIFICATIONS = False
    #SECRET_KEY = os.getenv('SECRET_KEY', 'your-default-secret-key')
    #JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-default-jwt-secret-key')
#Using os.getenv, you can fetch the environment variables SECRET_KEY and 
#JWT_SECRET_KEY. If they are not set, it will default to 'your-default-secret-key' 
#and 'your-default-jwt-secret-key', respectively. In production, you should set 
#these environment variables to ensure the security of your application.