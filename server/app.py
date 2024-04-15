from flask import Flask, request, jsonify  # Import request and jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from datetime import datetime, timedelta
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

    @app.route('/reservations', methods=['GET'])
    @jwt_required()  # Make sure the user is logged in
    def get_user_reservations():
        current_user_id = get_jwt_identity()
        print(f"Current User ID: {current_user_id}")  # Debugging
        user_reservations = Reservation.query.filter_by(user_id=current_user_id).all()
        print(f"Found {len(user_reservations)} reservations for user")  # Debugging
        reservations_data = [reservation.serialize() for reservation in user_reservations]
        return jsonify(reservations_data), 200

    @app.route('/reservations', methods=['POST'])
    def handle_reservations():
        data = request.json

        # Ensure all required fields are present
        required_fields = ['name', 'lastname', 'email', 'phonenumber', 'password', 'date', 'time', 'guest_count']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing one or more required fields.'}), 400

        # Check if the user already exists
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            # Create a new user if not found
            try:
                user = User(
                    name=data['name'],
                    lastname=data['lastname'],
                    email=data['email'],
                    phonenumber=data['phonenumber'],
                    password=data['password']  # Ensure password is handled securely
                )
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                return jsonify({'message': str(e)}), 400

        # Parse date and time
        try:
            date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            time = datetime.strptime(data['time'], '%H:%M').time()
        except ValueError as e:
            return jsonify({'message': 'Invalid date or time format.'}), 400

        # Create a reservation
        reservation = Reservation(
            user_id=user.id,
            name=data['name'],
            lastname=data['lastname'],
            email=data['email'],
            phonenumber=data['phonenumber'],
            date=date,
            time=time,
            guest_count=data['guest_count'],
            special_notes=data.get('specialNotes')
        )
        db.session.add(reservation)
        db.session.commit()

        return jsonify({'message': 'Reservation created successfully', 'reservation_id': reservation.id}), 201

    @app.route('/reservations/<int:reservation_id>', methods=['GET', 'PATCH', 'DELETE'])
    @jwt_required()
    def manage_reservation(reservation_id):
        reservation = Reservation.query.get_or_404(reservation_id)
        user_id = get_jwt_identity()

        if reservation.user_id != user_id:
            return jsonify({"message": "Unauthorized"}), 403

        if request.method == 'GET':
            return jsonify(reservation.serialize()), 200

        elif request.method == 'PATCH':
            data = request.get_json()
            try:
                if 'date' in data:
                    reservation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
                if 'time' in data:
                    reservation.time = datetime.strptime(data['time'], '%H:%M').time()
                
                for key, value in data.items():
                    if hasattr(reservation, key) and key not in ['date', 'time']:
                        setattr(reservation, key, value)

                db.session.commit()
                return jsonify({"message": "Reservation updated successfully"}), 200
            except ValueError as e:
                db.session.rollback()
                return jsonify({"error": "Invalid date or time format", "details": str(e)}), 400

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
