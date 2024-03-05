from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from config import Config
from flask_migrate import Migrate
from flask_restful import Api
from models import Users, MenuItem, Reservation, Menu, MenuItemForm
from flask_jwt_extended import jwt_required, get_jwt_identity  


app = Flask(__name__)
app.config.from_object(Config) 


# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Initialize SQLAlchemy
db = SQLAlchemy()
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)


# Initialize Flask-JWT-Extended
jwt = JWTManager(app)

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
    user_email = data.get('user_email')
    password = data.get('password')

    # Query the database to find a user with the provided username
    user = Users.query.filter_by(user_email=data['user_email']).first()


    if user and user.check_password(data['password']):
        # If the user exists and the password matches, create an access token
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/menu_items/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
def specific_menu_item(item_id):
    menu_item = MenuItem.query.get_or_404(item_id)
    
    if request.method == 'GET':
        return jsonify({
            'id': menu_item.id,
            'name': menu_item.name,
            'price': menu_item.price
        })
    elif request.method == 'PUT':
        data = request.json
        menu_item.name = data['name']
        menu_item.price = data['price']
        db.session.commit()
        return jsonify({'message': 'Menu item updated successfully'})
    elif request.method == 'DELETE':
        db.session.delete(menu_item)
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
                'price': item.price
            }
            for item in menu_items
        ]
        return jsonify([item.serialize() for item in menu_items]), 200
    elif request.method == 'POST':
        data = request.json
        new_menu_item = MenuItem(name=data['name'], price=data['price'])
        db.session.add(new_menu_item)
        db.session.commit()
        return jsonify({'message': 'Menu item created successfully'}), 201
    
# Routes for Reservations
@app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def reservation(reservation_id):
    current_user_id = get_jwt_identity()
    reservation = Reservation.query.get_or_404(reservation_id)
    
    # Check if the current user is the owner of the reservation
    if reservation.user_id != current_user_id:  # Assuming user_email stores the email
        return jsonify({'message': 'Unauthorized access'}), 403
    
    if request.method == 'GET':
        # Retrieve the reservation details and return as JSON response
        reservation_data = {
            'id': reservation.id,
            'email': reservation.user_email,  # Changed from user_id to reflect email-based identification
            'date_time': reservation.date_time.strftime("%Y-%m-%d %H:%M:%S"),
            'guest_size': reservation.guest_size,  # Corrected to use guest_size
            'special_requests': reservation.special_requests,
            'name': reservation.name,
            'lastname': reservation.lastname,
            'phonenumber': reservation.phonenumber,
            'menuItems': reservation.menu_items.split(','), 
        }
        return jsonify(reservation_data), 200

    elif request.method == 'PUT':
        data = request.json
        # Update reservation details based on data
        if 'date_time' in data:
            reservation_datetime_str = f"{data['date']} {data['time']}"
            reservation.date_time = datetime.strptime(reservation_datetime_str, '%Y-%m-%d %I:%M %p')
        if 'guest_size' in data:  
            reservation.guest_size = data['guest_size']
        if 'special_requests' in data:
            reservation.special_requests = data['special_requests']
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

# Initialize JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key
jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(debug=True, port=5555)

@app.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    current_user = get_jwt_identity()
    data = request.json
    
    # Convert the date and time strings to a datetime object
    reservation_datetime_str = f"{data['date']} {data['time']}"
    reservation_datetime = datetime.strptime(reservation_datetime_str, '%Y-%m-%d %I:%M %p')
    
    new_reservation = Reservation(
        user_id=current_user,
        name=data['name'],
        lastname=data['lastname'],
        email=data['email'],
        phonenumber=data['phonenumber'],
        date_time=reservation_datetime,
        guest_size=data['guests'],
        menu_items=','.join(data['menuItems']), 
        special_requests=data.get('specialNotes', '') 
    )
    
    db.session.add(new_reservation)
    db.session.commit()
    
    return jsonify({'message': 'Reservation created successfully', 'id': new_reservation.id}), 201

@app.route('/api/user_reservations', methods=['GET'])
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
