#models.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
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

reservation_menu_item = db.Table('reservation_menu_item',
    db.Column('reservation_id', db.Integer, db.ForeignKey('reservations.id'), primary_key=True),
    db.Column('menu_item_id', db.Integer, db.ForeignKey('menu_items.id'), primary_key=True)
)
   

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phonenumber = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    reservations = db.relationship('Reservation', back_populates='user')
    # Constructor
    def __init__(self, name, lastname, email, phonenumber, password):
        self.name = name
        self.lastname = lastname
        self.email = email
        self.phonenumber = phonenumber
        self.set_password(password)

    def set_password(self, password):
        """Create hashed password."""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """Check hashed password."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    @validates('email')
    def validate_user_email(self, key, value):  # Changed method name for clarity
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError("Invalid email address.")
        return value

    @validates('phonenumber')
    def validate_phonenumber(self, key, value):
        if not re.match(r"^\+?\d{10,15}$", value):
            raise ValueError("Invalid phone number format.")
        return value

class Reservation(db.Model, SerializerMixin):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    phonenumber = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)
    special_notes = db.Column(db.String(500), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Many-to-many relationship is set up with MenuItem
    menu_items = db.relationship('MenuItem', secondary=reservation_menu_item, back_populates='reservations')
    order_items = db.relationship('OrderList', back_populates='reservation')  # This matches the relationship name in OrderList
    user = db.relationship('User', back_populates='reservations')
    def __init__(self, name, lastname, email, phonenumber, date, time, guest_count, special_notes=None):
        self.name = name
        self.lastname = lastname
        self.email = email
        self.phonenumber = phonenumber
        self.date = date
        self.time = time
        self.guest_count = guest_count
        self.special_notes = special_notes

    #Validation methods
    @validates('name', 'lastname',)
    def validate_not_empty(self, key, value):
        if not value:
            raise ValueError(f"{key} cannot be empty.")
        return value

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError(f"{key} cannot be empty.")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email address.")
        return email

    @validates('phonenumber')
    def validate_phonenumber(self, key, phonenumber):
        if not phonenumber:
            raise ValueError(f"{key} cannot be empty.")
        if not re.match(r"^\+?\d{10,15}$", phonenumber):
            raise ValueError("Invalid phone number format.")
        return phonenumber

    @validates('guest_count')
    def validate_guest_count(self, key, value):
        if value <= 0:
            raise ValueError("Guest count must be greater than zero.")
        return value

    # Serialization 
    def serialize(self):
        """Converts this into a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'lastname': self.lastname,
            'email': self.email,
            'phonenumber': self.phonenumber,
            'date': self.date.isoformat(),
            'time': self.time.isoformat(),
            'guest_count': self.guest_count,
            'special_notes': self.special_notes,
            # Menu_items serialization defined in MenuItem
            'menu_items': [item.serialize() for item in self.menu_items]
        }

class MenuItem(db.Model, SerializerMixin):
    __tablename__ = 'menu_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    price = db.Column(db.Float)  # Allowing price to be nullable

    order_items = db.relationship('OrderList', back_populates='menu_item')
    reservations = db.relationship('Reservation', secondary=reservation_menu_item, back_populates='menu_items')


    def __init__(self, name, description, price=None):
        self.name = name
        self.description = description
        self.price = price

    def serialize(self):
        """Serializing menu item data for API responses."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': f"{self.price:.2f}" if self.price is not None else None
        }
    @validates('name')
    def validate_name(self, key, value):
        if not value:
            raise AssertionError('The name cannot be empty.')
        return value

    @validates('description')
    def validate_description(self, key, value):
        if not value:
            raise AssertionError('The description cannot be empty.')
        return value

    @validates('price')
    def validate_price(self, key, value):
        if value is not None and value < 0:
            raise AssertionError('The price cannot be negative.')
        return value

class OrderList(db.Model, SerializerMixin):
    __tablename__ = 'order_list'
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id'), primary_key=True)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    special_requests = db.Column(db.String(500))

    # Relationships
    reservation = db.relationship('Reservation', back_populates='order_items')  # Singular, indicating one-to-many from Reservation to OrderList
    menu_item = db.relationship('MenuItem', back_populates='order_items')

    def __init__(self, reservation_id, menu_item_id, quantity=1, special_requests=None):
        self.reservation_id = reservation_id
        self.menu_item_id = menu_item_id
        self.quantity = quantity
        self.special_requests = special_requests

    def serialize(self):
        """Converts this into a dictionary for API responses."""
        return {
            'reservation_id': self.reservation_id,
            'menu_item_id': self.menu_item_id,
            'quantity': self.quantity,
            'special_requests': self.special_requests
        }

def init_app(app):
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        pass