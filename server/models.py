from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from flask_restful import Api, Resource, reqparse
from . import config
from .serializers import SerializerMixin
from .config import app, db, api



app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key

db = SQLAlchemy(app)
jwt = JWTManager(app)

class Users(db.Model,SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    user_email = db.Column(db.String, nullable=False)
    passwordhash = db.Column(db.String, nullable=False)

    #__RELATIONSHIPS
    reservations = db.relationship("Reservations", back_populates="user")

    #_SERIALIZATION
    serialize_rules = ('-reservations.user', )

    #_VALIDATIONS
    @validates('username')
    def validate_username(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    @validates('passwordhash')
    def validate_passwordhash(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    @validates('user_email')
    def validate_user_email(self, key, value):
         if re.match(r"[^@]+@[^@]+\.[^@]+", value):
            return value
         else:
             raise ValueError("Invalid email format")

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

class MenuItemForm(FlaskForm):
    name = StringField('Name', validators=[InputRequired()])
    description = StringField('Description', validators=[InputRequired()])
    price = FloatField('Price', validators=[InputRequired(), NumberRange(min=0.01)])

    #__RELATIONSHIPS
    reservations = db.relationship("Reservations", back_populates="menu")

    #_SERIALIZATION
    serialize_rules = ('-reservation.menu', )

    #_VALIDATIONS
    @validates('menu_name')
    def validate_name(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    @validates('menu_description')
    def validate_description(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    @validates('menu_price')
    def validate_price(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError

class Menus(db.Model,SerializerMixin):
    __tablename__ = "menus"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    reservations = db.relationship("Reservations", back_populates="menu")

    #_SERIALIZATION
    serialize_rules = ('-reservations.menu', )

    #_VALIDATIONS
    @validates('menu_name')
    def validate_name(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    @validates('menu_description')
    def validate_description(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    @validate_descriptions('menu_price')
    def validate_price(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    def __repr__(self):
        return f'<Menu {self.id}, {self.name}>'

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.String(1000), nullable=False)
    phone_number = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.utcnow)
    date_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    guest_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=False)
    # ADD the ForeignKey function to pull the user and menu from the users and menus tables
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    menu_id = db.Column(db.Integer, db.ForeignKey("menu.id"))

    # ADD the DateTime function to pull current date and time to populate this column
    date_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    #__RELATIONSHIPS
    user = db.relationship("Users", back_populates = "reservations")
    menu = db.relationship("Menus", back_populates = "reservations")

    #_SERIALIZATIONS
    serialize_rules = ('-user.reservations', '-menu.reservations', )
    #_VALIDATIONS
    @validates('first_name')
    def validate_first_name(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('last_name')
    def validate_last_name(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('notes')
    def validate_notes(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('phone_number')
    def validate_phone_number(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('email')
    def validate_email(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('date')
    def validate_date(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('date_time')
    def validate_date_time(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('user_id')
    def validate_user_id(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('guest_id')
    def validate_guest_id(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    @validates('menu_id')
    def validate_menu_id(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
        
    def __repr__(self):
        return f'<Reservations {self.id}, {self.reservations}, {self.user_id}, {self.menu_id}>'
    
