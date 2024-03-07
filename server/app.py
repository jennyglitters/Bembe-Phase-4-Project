#app.py 
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from flask_migrate import Migrate
from flask_restful import Api
from models import db, User, MenuItem, Reservation
import os
from config import Config
def create_app():
    app = Flask(__name__)
    # Database configuration
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
    #app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # JWT and Secret Key configuration
    #app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    #app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
    #app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config.from_object(Config)
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    Migrate(app, db)
    api = Api(app)

    #@app.before_first_request
    #def create_tables():
       # db.create_all()

    # User registration
    @app.route('/users/register', methods=['POST'])
    def register_user():
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        if User:
            return jsonify({'message': 'Email already registered.'}), 400
        #hashed_password = generate_password_hash(data['password'], method='sha256')
        user = User(name=data['name'], lastname=data['lastname'],
                    email=data['email'], phonenumber=data['phonenumber'],
                    password=data['password'])
                    #password_hash=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    

    @app.route('/users/exists', methods=['GET'])
    def check_user_exists():
        email = request.args.get('email')
        user = User.query.filter_by(email=email).first()
        return jsonify(bool(user))
    
    # User login
    @app.route('/users/login', methods=['POST'])
    def login_user():
        data = request.json
        #print("Login Attempt:", data)  # Debug print
        user = User.query.filter_by(email=data['email']).first()
        #if user:
            #print("User found:", user.email)  # More debug print
        if user and user.check_password_hash( data['password']):#user.password_hash,
            access_token = create_access_token(identity=data['user.id'])#data['email']
            return jsonify(access_token=access_token), 200
        return jsonify({"message": "Invalid credentials."}), 401

    # Reservation management
    @app.route('/reservations', methods=['POST'])
    @jwt_required()
    def create_reservation():
        user_id = get_jwt_identity()
        data = request.json
        reservation = Reservation(user_id=user_id, **data)
        db.session.add(reservation)
        db.session.commit()
        return jsonify(reservation.serialize()), 201
    #     if request.method == 'GET':
    #         current_user_email = get_jwt_identity()
    #         user = User.query.filter_by(email=current_user_email).first()
    #         reservations = Reservation.query.filter_by(user_id=user.id).all()
    #         return jsonify([reservation.serialize() for reservation in reservations]), 200
    #     elif request.method == 'POST':
    #         current_user_email = get_jwt_identity()
    #         user = User.query.filter_by(email=current_user_email).first()
    #         data = request.json
    #         reservation = Reservation(user_id=user.id, **data)
    #         db.session.add(reservation)
    #         db.session.commit()
    #         return jsonify({"message": "Reservation created successfully"}), 201

    @app.route('/reservations/user/<int:user_id>', methods=['GET'])
    @jwt_required()
    def get_user_reservations(user_id):
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({"msg": "Unauthorized"}), 401
        reservations = Reservation.query.filter_by(user_id=user_id).all()
        return jsonify([reservation.serialize() for reservation in reservations]), 200


    #  Specific reservation management
    @app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
    @jwt_required()
    def manage_reservation(reservation_id):
        reservation = Reservation.query.get_or_404(reservation_id)
        current_user_id = get_jwt_identity()
        if reservation.user_id != current_user_id:
         return jsonify({"msg": "Unauthorized"}), 403
    
        if request.method == 'GET':
            return jsonify(reservation.serialize()), 200

        # current_user_email = get_jwt_identity()
        # if reservation.user.email != current_user_email:
        #     return jsonify({"message": "Unauthorized"}), 403

        if request.method == 'PUT':
            data = request.json
            for key, value in data.items():
                if hasattr(reservation, key):
                 setattr(reservation, key, value)
            db.session.commit()
            return jsonify({"message": "Reservation updated successfully"}), 200

        elif request.method == 'DELETE':
            db.session.delete(reservation)
            db.session.commit()
            return jsonify({"message":"Reservation deleted successfully"}), 200

    # Menu items management
    @app.route('/menu_items', methods=['GET', 'POST'])
    def menu_items():
        if request.method == 'GET':
            items = MenuItem.query.all()
            return jsonify([item.serialize() for item in items]), 200
        elif request.method == 'POST':
            data = request.json
            menu_item = MenuItem(**data)
            db.session.add(menu_item)
            db.session.commit()
            return jsonify({"message": "Menu item added successfully"}), 201

    # Specific menu item management
    @app.route('/menu_items/<int:menu_item_id>', methods=['GET', 'PUT', 'DELETE'])
    def manage_menu_item(menu_item_id):
        menu_item = MenuItem.query.get_or_404(menu_item_id)
        if request.method == 'GET':
            return jsonify(menu_item.serialize()), 200

        if request.method == 'PUT':
            data = request.json
            for key, value in data.items():
                setattr(menu_item, key, value)
            db.session.commit()
            return jsonify({"message": "Menu item updated successfully"}), 200

        elif request.method == 'DELETE':
            db.session.delete(menu_item)
            db.session.commit()
            return jsonify({"message": "Menu item deleted successfully"}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)
