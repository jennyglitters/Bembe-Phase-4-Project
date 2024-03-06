# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from flask_migrate import Migrate
from flask_restful import Api
from models import init_app, db, Users, MenuItem, Reservation
from datetime import datetime

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    init_app(app)
    jwt = JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    Migrate(app, db)
    api = Api(app)
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
    app.config['SECRET_KEY'] = 'your-secret-key'

    @app.before_first_request
    def create_tables():
        db.create_all()

    # Routes for Users
    @app.route('/users', methods=['GET', 'POST'])
    def users():
        if request.method == 'GET':
            users = Users.query.all()
            users_json = [{'id': user.id, 'email': user.user_email} for user in users]
            return jsonify(users_json), 200
        elif request.method == 'POST':
            data = request.json
            if not data.get('email') or not data.get('password'):
                return jsonify({'message': 'Email and password are required'}), 400

            if Users.query.filter_by(user_email=data['email']).first():
                return jsonify({'message': 'User already exists'}), 409
            try:
                new_user = Users(user_email=data['email'])#, user_password=data['password'])  # Adjusted to match Users __init__ signature
                new_user.set_password(data['password'])
                db.session.add(new_user)
                db.session.commit()
                return jsonify({'message': 'User created successfully'}), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'message': 'An error occurred during user creation'}), 500

    @app.route('/users/login', methods=['POST'])
    def login():
        data = request.json
        user = Users.query.filter_by(user_email=data.get('email')).first()
        if user and user.check_password(data.get('password')):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/reservations', methods=['GET', 'POST'])
    def reservations():
        if request.method == 'GET':
            email = request.args.get('email')
            if not email:
                return jsonify({"error": "Missing email query parameter"}), 400

            reservation = Reservation.query.filter_by(user_email=email).order_by(Reservation.date_time.desc()).first()
            if reservation:
                return jsonify(reservation.serialize()), 200
            else:
                return jsonify({"message": "No reservation found for the provided email"}), 404
        elif request.method == 'POST':
            current_user_id = get_jwt_identity()
            data = request.json

            date_str = data.get('date')  # Expected in 'YYYY-MM-DD' format
            time_str = data.get('time')  # Expected in 'HH:MM' format
            guest_size = int(data.get('guest_size', 0))

            if not date_str or not time_str or guest_size <= 0:
                return jsonify({'message': 'Date, time, and guest size are required'}), 400

            try:
                reservation_datetime = datetime.strptime(f"{date_str} {time_str}", '%Y-%m-%d %H:%M')
            except ValueError:
                return jsonify({'message': 'Invalid date or time format'}), 400

            total_guests = db.session.query(db.func.sum(Reservation.guest_size)).filter(
                db.func.date(Reservation.date_time) == reservation_datetime.date()
            ).scalar() or 0

            if total_guests + guest_size > 20:
                return jsonify({'message': 'Guest capacity limit exceeded for this day'}), 400
            try:
                new_reservation = Reservation(
                    user_id=current_user_id,
                    menu_id=data.get('menu_id'),
                    date_time=reservation_datetime,
                    guest_size=guest_size,
                    special_notes=data.get('special_notes'),
                    name=data.get('name'),
                    lastname=data.get('lastname'),
                    phonenumber=data.get('phonenumber'),
                    menu_items=data.get('menu_items', '').split(',')
                )

                db.session.add(new_reservation)
                db.session.commit()
                return jsonify({'message': 'Reservation created successfully', 'id': new_reservation.id}), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'message': 'An error occurred during reservation creation'}), 500

    # Routes for Menu Items by ID
    @app.route('/menu_items/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
    def specific_menu_item(item_id):
        menu_item = MenuItem.query.get_or_404(item_id)

        if request.method == 'GET':
            return jsonify(menu_item.serialize())
        elif request.method == 'PUT':
            data = request.json
            if 'name' in data:
                menu_item.name = data['name']
            if 'description' in data:
                menu_item.description = data['description']
            if 'price' in data:
                menu_item.price = data['price']
            db.session.commit()
            return jsonify({'message': 'Menu item updated successfully'})
        elif request.method == 'DELETE':
            db.session.delete(menu_item)
            db.session.commit()
            return jsonify({'message': 'Menu item deleted successfully'})

    # Routes for Menu Items
    @app.route('/menu_items', methods=['GET', 'POST'])
    def menu_items():
        if request.method == 'GET':
            items = MenuItem.query.all()
            return jsonify([item.serialize() for item in items]), 200
        elif request.method == 'POST':
            data = request.json
            new_item = MenuItem(name=data['name'], description=data['description'], price=data['price'])
            db.session.add(new_item)
            db.session.commit()
            return jsonify({'message': 'Menu item created successfully'}), 201

    # Routes for Reservations by ID
    @app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
    @jwt_required()
    def handle_reservation(reservation_id):
        current_user_id = get_jwt_identity()
        reservation = Reservation.query.get_or_404(reservation_id)
        if reservation.user_id != current_user_id:
            return jsonify({'message': 'Unauthorized access'}), 403
        if request.method == 'GET':
            return jsonify(reservation.serialize()), 200
        elif request.method == 'PUT':
            data = request.json
            # Guest size validation and capacity check
            guest_size = int(data.get('guest_size', reservation.guest_size))  # Default to current if not provided
            if guest_size <= 0:
                return jsonify({'message': 'Valid guest size is required'}), 400
            # Check if updating guest size exceeds capacity
            if 'guest_size' in data:
                total_guests_excl_current = db.session.query(db.func.sum(Reservation.guest_size)).filter(
                    db.func.date(Reservation.date_time) == reservation.date_time.date(),
                    Reservation.id != reservation_id
                ).scalar() or 0
                if total_guests_excl_current + guest_size > 20:
                    return jsonify({'message': 'Guest capacity limit exceeded for this day'}), 400
            reservation.guest_size = guest_size  # Update guest size only if capacity check passes
            # Update other fields
            if 'date' in data and 'time' in data:
                try:
                    reservation.date_time = datetime.strptime(f"{data['date']} {data['time']}", '%Y-%m-%d %H:%M')
                except ValueError:
                    return jsonify({'message': 'Invalid date or time format'}), 400
            reservation.special_notes = data.get('special_notes', reservation.special_notes)
            reservation.name = data.get('name', reservation.name)
            reservation.lastname = data.get('lastname', reservation.lastname)
            reservation.phonenumber = data.get('phonenumber', reservation.phonenumber)
            if 'menu_items' in data:
                reservation.menu_items = ','.join(data['menu_items'])
            db.session.commit()
            return jsonify({'message': 'Reservation updated successfully'}), 200
        elif request.method == 'DELETE':
            db.session.delete(reservation)
            db.session.commit()
            return jsonify({'message': 'Reservation deleted successfully'})

    @app.route('/user_reservations', methods=['GET'])
    @jwt_required()
    def get_user_reservations():
        current_user_id = get_jwt_identity()
        user_reservations = Reservation.query.filter_by(user_id=current_user_id).all()
        return jsonify([reservation.serialize() for reservation in user_reservations]), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)