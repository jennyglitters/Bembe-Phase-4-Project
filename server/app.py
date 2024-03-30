from flask import Flask, request, jsonify  # Import request and jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from datetime import timedelta
from models import db, User, MenuItem, Reservation, OrderList  # Import your database models

def create_app():
    # Instantiate Flask app
    app = Flask(__name__)

    # Configure your Flask app
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bembe.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.json.compact = False

    # Set secret keys for JWT
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'

    # Set JWT access token expiration
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    # Initialize extensions with the application instance
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Flask-Migrate
    jwt = JWTManager(app)  # Initialize JWTManager
    CORS(app, resources={r"/*": {"origins": "*"}})

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

    @app.route('/reservations', methods=['POST'])
    @jwt_required(optional=True)
    def handle_reservations():
        data = request.json
        user_id = get_jwt_identity()

        # Handle new user registration or identify the existing user
        if not user_id:
            user = User.query.filter_by(email=data['email']).first()
            if user and 'password' in data:
                # Conflict: trying to register an existing email with a password
                return jsonify({'message': 'Email already registered.'}), 409
            elif not user:
                # New user registration
                if 'password' not in data:
                    return jsonify({'message': 'Password is required for new user registration.'}), 400
                user = User(
                    name=data['name'],
                    lastname=data['lastname'],
                    email=data['email'],
                    phonenumber=data['phonenumber']
                )
                user.set_password(data['password'])
                db.session.add(user)
                db.session.flush()  # Flush to assign an ID without committing
                user_id = user.id

        # Ensure user_id is available for reservation creation
        if not user_id:
            return jsonify({"message": "User identification failed."}), 400

        # Create or update reservation
        if 'reservationId' in data:
            # Assuming reservation update logic here (not covered for brevity)
            pass
        else:
            # New reservation creation
            reservation = Reservation(
                user_id=user_id,
                name=data['name'],
                lastname=data['lastname'],
                email=data['email'],
                phonenumber=data['phonenumber'],
                date=data['date'],
                time=data['time'],
                guest_count=data['guests'],  # Assuming 'guests' field from the form maps to 'guest_count'
                special_notes=data['specialNotes'] if 'specialNotes' in data else None
            )
            db.session.add(reservation)
            db.session.flush()  # Flush to assign an ID to the reservation without committing

            # Handling menuItems association
            if 'menuItems' in data and isinstance(data['menuItems'], list):
                for menu_item_id in data['menuItems']:
                    menu_item = MenuItem.query.get(menu_item_id)
                    if menu_item:
                        reservation.menu_items.append(menu_item)

            db.session.commit()
            return jsonify({"message": "Reservation created successfully"}), 201

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

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)
