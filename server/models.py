#models.py
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
from config import Config

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate()

def init_app(app):
    db.init_app(app)
    migrate.init_app(app, db)

class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String, unique=True, nullable=False)
    passwordhash = db.Column(db.String, nullable=False)

    # Relationship with Reservation
    reservations = db.relationship("Reservation", back_populates="user")

    def __init__(self, user_email, user_password):
        self.user_email = user_email
        self.set_password(user_password)

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.passwordhash.encode('utf-8'))

    def set_password(self, password):
        self.passwordhash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    @validates('passwordhash', 'user_email')
    def validate_fields(self, key, value):
        if key == 'passwordhash' and len(value) != 60:
            raise ValueError("Invalid password hash")
        elif key == 'user_email' and not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError("Invalid user_email")
        return value

class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey("menus.id"))

    # Relationship with Reservation through association table
    reservations = db.relationship('Reservation', secondary='reservation_menu_item', back_populates='menu_items')

    @validates('name', 'description', 'price')
    def validate_fields(self, key, value):
        if key == 'name' and not (0 < len(value) <= 100):
            raise ValueError("Invalid name")
        elif key == 'description' and not (0 < len(value) <= 100):
            raise ValueError("Invalid description")
        elif key == 'price' and not (0 < value):
            raise ValueError("Invalid price")
        return value
class MenuItemForm(FlaskForm):
    name = StringField('Name', validators=[InputRequired(), Length(max=100)])  # Max length aligned with the model
    description = StringField('Description', validators=[InputRequired(), Length(max=100)])  # Max length aligned with the model
    price = FloatField('Price', validators=[InputRequired(), NumberRange(min=0)])  # Ensure price is non-negative

class Menu(db.Model):
    __tablename__ = "menus"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

    # Relationship with MenuItem
    items = db.relationship('MenuItem', backref='menu', lazy=True)

    # Relationship with Reservation
    reservations = db.relationship("Reservation", back_populates="menu")

    @validates('name', 'description', 'price')
    def validate_fields(self, key, value):
        if key == 'name' and not (0 < len(value) <= 100):
            raise ValueError("Invalid name")
        elif key == 'description' and not (0 < len(value) <= 100):
            raise ValueError("Invalid description")
        elif key == 'price' and not (0 <= value):
            raise ValueError("Invalid price")
        return value

class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'))

    # Relationships
    user = db.relationship("Users", back_populates="reservations")
    menu = db.relationship("Menu", back_populates="reservations")
    menu_items = db.relationship("MenuItem", secondary='reservation_menu_item', back_populates="reservations")

    @validates('user_id', 'menu_id')
    def validate_fields(self, key, value):
        if key in ['user_id', 'menu_id'] and not isinstance(value, int):
            raise ValueError(f"Invalid {key}")
        return value

# Association Table for MenuItem and Reservation
reservation_menu_item = db.Table('reservation_menu_item',
    db.Column('reservation_id', db.Integer, db.ForeignKey('reservations.id'), primary_key=True),
    db.Column('menu_item_id', db.Integer, db.ForeignKey('menu_items.id'), primary_key=True)
)