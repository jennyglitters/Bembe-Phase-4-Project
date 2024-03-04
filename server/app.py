from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from config import Config
from models import Users  # Assuming Users model is imported from models.py
from flask_migrate import Migrate
from flask_restful import Api

# Instantiate Flask app
app = Flask(__name__)
app.config.from_object(Config)  # Load configuration from Config class

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

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
                'username': user.username,
                'email': user.user_email
            }
            for user in users
        ]
        return jsonify(users_json), 200
    elif request.method == 'POST':
        data = request.json
        new_user = Users(
            username=data.get('username'),
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
    username = data.get('username')
    password = data.get('password')

    # Query the database to find a user with the provided username
    user = Users.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # If the user exists and the password matches, create an access token
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401
@app.route('/api/menu_items/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
def menu_item(item_id):
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
@app.route('/api/menu_items', methods=['GET', 'POST'])
def menu_item():
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
        return jsonify(menu_items_json)
    elif request.method == 'POST':
        data = request.json
        new_menu_item = MenuItem(name=data['name'], price=data['price'])
        db.session.add(new_menu_item)
        db.session.commit()
        return jsonify({'message': 'Menu item created successfully'}), 201
    

@app.route('/api/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def reservation(reservation_id):
    current_user = get_jwt_identity()
    reservation = Reservation.query.get_or_404(reservation_id)
    if reservation.user_id!= current_user:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    if request.method == 'GET':
        # Implement logic to retrieve a reservation
        pass
    elif request.method == 'PUT':
        data = request.json
        # Implement logic to update a reservation
        pass
    elif request.method == 'DELETE':
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({'message': 'Reservation deleted successfully'})
    else:
        return jsonify({'message': 'Method not allowed'}), 405
    return jsonify({'message': 'Reservation retrieved successfully'}), 200

# Initialize JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key
jwt = JWTManager(app)




if __name__ == '__main__':
    app.run(debug=True, port=5555)
