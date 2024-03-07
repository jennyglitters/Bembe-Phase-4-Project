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
    app.config.from_object(Config)
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    Migrate(app, db)
    api = Api(app)

    @app.route('/users/register', methods=['POST'])
    def register_user():
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        if user:
            return jsonify({'message': 'Email already registered.'}), 400
        
        user = User(
            name=data['name'], 
            lastname=data['lastname'],
            email=data['email'], 
            phonenumber=data['phonenumber']
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201

    @app.route('/users/login', methods=['POST'])
    def login_user():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
            return jsonify(access_token=access_token), 200

        return jsonify({"message": "Invalid credentials."}), 401

    @app.route('/reservations', methods=['POST', 'GET'])
    @jwt_required(optional=True)
    def handle_reservations():
        if request.method == 'GET':
            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({"message": "Authentication required"}), 401
            reservations = Reservation.query.filter_by(user_id=user_id).all()
            return jsonify([reservation.serialize() for reservation in reservations]), 200

        elif request.method == 'POST':
            data = request.json
            user_id = get_jwt_identity() or data.get('user_id')

            if not user_id:
                # Handle new or unauthenticated user
                user = User.query.filter_by(email=data['email']).first()
                if not user:
                    user = User(
                        name=data['name'], 
                        lastname=data['lastname'],
                        email=data['email'], 
                        phonenumber=data['phonenumber']
                    )
                    user.set_password(data['password'])  # You might want to set a random password or handle this differently
                    db.session.add(user)
                    db.session.commit()
                    user_id = user.id

            reservation = Reservation(
                user_id=user_id,
                name=data['name'],
                date=data['date'],
                time=data['time'],
                guests=data['guests'],
                menuItems=data['menuItems'],
                specialNotes=data['specialNotes']
            )
            db.session.add(reservation)
            db.session.commit()
            return jsonify({"message": "Reservation created/updated successfully"}), 201

    @app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
    @jwt_required()
    def manage_reservation(reservation_id):
        reservation = Reservation.query.get_or_404(reservation_id)
        user_id = get_jwt_identity()

        if reservation.user_id != user_id:
            return jsonify({"message": "Unauthorized"}), 403

        if request.method == 'GET':
            return jsonify(reservation.serialize()), 200

        elif request.method == 'PUT':
            data = request.json
            for key, value in data.items():
                setattr(reservation, key, value)
            db.session.commit()
            return jsonify({"message": "Reservation updated successfully"}), 200

        elif request.method == 'DELETE':
            db.session.delete(reservation)
            db.session.commit()
            return jsonify({"message": "Reservation deleted successfully"}), 200

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

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)
