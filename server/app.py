#app.py
from flask import Flask, request,jsionify
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
    jwt = JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    Migrate(app, db)
    api = Api(app)
    init_app(app)
    # Initialize JWT
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key


    # Initialize the database
    @app.before_first_request
    def create_tables():
        db.create_all()

    # Routes for Users
    @app.route('/users', methods=['GET', 'POST'])
    def users():
        if request.method == 'GET':
            users = Users.query.all()
            users_json = [
                {
                    'id': user.id,
                    'email': user.user_email
                }
                for user in users
            ]
            return jsonify(users_json), 200
        elif request.method == 'POST':
            data = request.json
            new_user = Users(
                user_email=data.get('email'),
                passwordhash=data.get('password')  # Assuming you're storing password hash in 'passwordhash' field
            )
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'User created successfully'}), 201
        else:
            return jsonify({'message': 'Method not allowed'}), 405

    # Route for User Authentication
    @app.route('/users/login', methods=['POST'])
    def login():
        data = request.json
        user = Users.query.filter_by(user_email=data['email']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token), 200
        If the user exists, create an access token
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'message': 'User not found'}), 404

    @app.route('/reservations', methods=['GET'])
    def get_reservation_by_email():
        email = request.args.get('email')
        if not email:
            return jsonify({"error": "Missing email query parameter"}), 400

        reservation = Reservation.query.filter_by(email=email).order_by(desc(Reservation.date_time)).first()
        if reservation:
            return jsonify(reservation.serialize()), 200  # Assuming your model has a serialize method to convert to dict
        else:
            return jsonify({"message": "No reservation found for the provided email"}), 404

    # Routes for Menu Items by ID
    @app.route('/menu_items/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
    def specific_menu_item(item_id):
        menuItem = MenuItem.query.get_or_404(item_id)

        if request.method == 'GET':
            return jsonify(menuItem.serialize())
        elif request.method == 'PUT':
            data = request.json
            if 'name' in data:
                menuItem.name = data['name']
            if 'description' in data:      
                menuItem.description = data['description']
            if 'price' in data:
                menuItem.price = data['price']
            db.session.commit()
            return jsonify({'message': 'Menu item updated successfully'})
        elif request.method == 'DELETE':
            db.session.delete(menuItem)
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

    # Routes for Reservations
    @app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
    @jwt_required()
    def handle_reservation(reservation_id):
        current_user_id = get_jwt_identity()
        reservation = Reservation.query.get_or_404(reservation_id)

        # Check if the current user is the owner of the reservation
        if reservation.user_id != current_user_id:  # Assuming user_email stores the email
            return jsonify({'message': 'Unauthorized access'}), 403

        if request.method == 'GET':
            reservation_data = {
                'id': reservation.id,
                'email': reservation.user_email,  # Changed from user_id to reflect email-based identification
                'date_time': reservation.date_time.strftime("%Y-%m-%d %H:%M:%S"),
                'guest_size': reservation.guests,  # Corrected to use guest_size
                'special_notes': reservation.special_notes,
                'name': reservation.name,
                'lastname': reservation.lastname,
                'phonenumber': reservation.phonenumber,
                'menuItems': reservation.menuItems.split(','), 
            }
            return jsonify(reservation_data), 200

        elif request.method == 'PUT':
            data = request.json
            # Update reservation details based on data
            if 'date_time' in data:
                reservation_datetime_str = f"{data['date']} {data['time']}"
                reservation.date_time = datetime.strptime(reservation_datetime_str, '%Y-%m-%d %I:%M %p')
            if 'guests' in data:  
                reservation.guests = data['guests']
            if 'special_notes' in data:
                reservation.special_notes = data['special_notes']
            if 'name' in data:
                reservation.name = data['name']
            if 'lastname' in data:
                reservation.lastname = data['lastname']
            if 'phonenumber' in data:
                reservation.phonenumber = data['phonenumber']
            if 'menuItems' in data:
                reservation.menu_items = ','.join(data['menuItems'])

            db.session.commit()
            return jsonify({'message': 'Reservation updated successfully'}), 200

        if request.method == 'DELETE':
            db.session.delete(reservation)
            db.session.commit()
            return jsonify({'message': 'Reservation deleted successfully'}), 200

    @app.route('/reservations', methods=['POST'])
    @jwt_required()
    def create_reservation():
        current_user_id = get_jwt_identity()
        data = request.json
    if not all(key in data for key in ['date_time', 'menu_id']):
        return jsonify({'message': 'Missing data'}), 400
    try:
        date_time = datetime.fromisoformat(data['date_time'])
    except ValueError:
        return jsonify({'message': 'Invalid date format'}), 400

        # Parse date and time from the frontend format
        reservation_datetime = datetime.strptime(f"{data['date']} {data['time']}", '%Y-%m-%d %I:%M %p')

        # Adjusting to use 'specialNotes' as received from the frontend
        new_reservation = Reservation(
            user_id=current_user_id,
            menu_id=data['menu_id'],
            email=data['email'],
            date_time=date_time,
            name=data['name'],
            lastname=data['lastname'],
            phonenumber=data['phonenumber'],
            date=data['date'],
            time=data['time'],
            guest_size=data['guests'],
            menuItems=",".join(data['menuItems']),  # Assuming menuItems is an array of strings
            specialNotes=data.get('specialNotes', '')  # Adjusted field name to match frontend
        )

        db.session.add(new_reservation)
        db.session.commit()

        return jsonify({'message': 'Reservation created successfully', 'id': new_reservation.id}), 201

    @app.route('/user_reservations', methods=['GET'])
    @jwt_required()
    def get_user_reservations():
        current_user_id = get_jwt_identity()
        user_reservations = Reservation.query.filter_by(user_id=current_user_id).all()
        return jsonify([reservation.serialize() for reservation in user_reservations]), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400

    if Users.query.filter_by(user_email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 409

    new_user = Users(user_email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)