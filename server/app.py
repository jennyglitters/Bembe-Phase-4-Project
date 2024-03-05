from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from config import db
from flask_migrate import Migrate
from flask_restful import Api
from models import Users, MenuItem, Reservation, Menu, MenuItemForm
from flask_jwt_extended import jwt_required, get_jwt_identity  
from datetime import datetime

app = Flask(__name__)
app.config.from_object(db.config) 


# Enable Cross-Origin Resource Sharing (CORS)
CORS(app, resources={r"/*": {"origins": "*"}})  # Adjusted to allow all routes

# Initialize SQLAlchemy
db = SQLAlchemy()
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize REST API
api = Api(app)

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

    if user:
        # If the user exists, create an access token
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
        return jsonify({
            'id': menuItem.id,
            'name': menuItem.name,
            'price': menuItem.price
        })
    elif request.method == 'PUT':
        data = request.json
        menuItem.name = data['name']
        menuItem.price = data['price']
        db.session.commit()
        return jsonify({'message': 'Menu item updated successfully'})
    elif request.method == 'DELETE':
        db.session.delete(menuItem)
        db.session.commit()
        return jsonify({'message': 'Menu item deleted successfully'})

# Routes for Menu Items
@app.route('/menu_items', methods=['GET', 'POST'])
def get_menu_items():
    if request.method == 'GET':
        menu_items = MenuItem.query.all()
        menu_items_json = [
            {
                'id': item.id,
                'name': item.name,
                'price': item.price,
                'description': item.description
            }
            for item in menu_items
        ]
        return jsonify(menu_items_json), 200
    elif request.method == 'POST':
        data = request.json
        new_menu_item = MenuItem(name=data['name'], price=data['price'])
        db.session.add(new_menu_item)
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

    elif request.method == 'DELETE':
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({'message': 'Reservation deleted successfully'}), 200

@app.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    current_user = get_jwt_identity()
    data = request.json
<<<<<<< HEAD
    
    # Convert the date and time strings to a datetime object
    reservation_datetime_str = f"{data['date']} {data['time']}"
    reservation_datetime = datetime.strptime(reservation_datetime_str, '%Y-%m-%d %I:%M %p')
=======

    # Parse date and time from the frontend format
    reservation_datetime = datetime.strptime(f"{data['date']} {data['time']}", '%Y-%m-%d %I:%M %p')

    # Adjusting to use 'specialNotes' as received from the frontend
>>>>>>> 82344ca2c6496bb639f513b0ecf3263e5c2add85
    new_reservation = Reservation(
        user_id=current_user,
        email=data['email'],
        date_time=reservation_datetime,
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

# Initialize JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key
jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(debug=True, port=5555)
