from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import re
import bcrypt
from datetime import datetime
from flask_migrate import Migrate
from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import InputRequired, Length, NumberRange
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from app import db

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)


class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    user_email = db.Column(db.String, nullable=False)
    passwordhash = db.Column(db.String, nullable=False)

    reservations = db.relationship("Reservation", back_populates="user")

    def __init__(self, username, user_email, user_password):
        self.username = username
        self.user_email = user_email
        self.set_password(user_password)

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.passwordhash.encode('utf-8'))

    def set_password(self, password):
        self.passwordhash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    @validates('username', 'passwordhash', 'user_email')
    def validate_fields(self, key, value):
        if key == 'username' and 0 < len(value) <= 25:
            return value
        elif key == 'passwordhash' and 0 < len(value) <= 25:
            return value
        elif key == 'user_email' and re.match(r"[^@]+@[^@]+\.[^@]+", value):
            return value
        else:
            raise ValueError(f"Invalid {key}")

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    menu_id = db.Column(db.Integer, db.ForeignKey("menus.id"))

class MenuItemForm(FlaskForm):
    name = StringField('Name', validators=[InputRequired(), Length(min=1, max=25)])
    description = StringField('Description', validators=[InputRequired(), Length(min=1, max=25)])
    price = FloatField('Price', validators=[InputRequired(), NumberRange(min=0.01)])
class Menu(db.Model):
    __tablename__ = "menus"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    reservations = db.relationship("Reservation", back_populates="menu")

    @validates('name', 'description', 'price')
    def validate_fields(self, key, value):
        if key == 'name' and 0 < len(value) <= 25:
            return value
        elif key == 'description' and 0 < len(value) <= 25:
            return value
        elif key == 'price' and 0 < value <= 25:
            return value
        else:
            raise ValueError(f"Invalid {key}")

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.String(1000), nullable=False)
    phone_number = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    date_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    guest_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=False)

    user = db.relationship("Users", back_populates="reservations")
    menu = db.relationship("Menu", back_populates="reservations")

    @validates('first_name', 'last_name', 'notes', 'phone_number', 'email', 'date', 'date_time', 'user_id', 'menu_id')
    def validate_fields(self, key, value):
        if isinstance(value, str) and 0 < len(value) <= 1000:
            return value
        elif isinstance(value, datetime):
            return value
        elif isinstance(value, int):
            return value
        else:
            raise ValueError(f"Invalid {key}")
    db.create_all()
if __name__ == '__main__':


