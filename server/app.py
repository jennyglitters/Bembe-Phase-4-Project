from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from models import db, User, MenuItem, Reservation
import os
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    Migrate(app, db)
    api = Api(app)

    def get_or_create_user(email, data):
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                name=data.get('name', ''), 
                lastname=data.get('lastname', ''),
                email=email, 
                phonenumber=data.get('phonenumber', '')
            )
            db.session.add(user)
            db.session.commit()
        return user

    @app.route('/reservations', methods=['POST', 'GET'])
    def handle_reservations():
        email = request.args.get('email')
        if not email:
            return jsonify({"message": "Email is required"}), 400

        user = get_or_create_user(email, request.json)

        if request.method == 'GET':
            reservations = Reservation.query.filter_by(user_id=user.id).all()
            return jsonify([reservation.serialize() for reservation in reservations]), 200

        elif request.method == 'POST':
            data = request.json
            menu_item_ids = data.get('menuItems', [])
            reservation = Reservation(
                user_id=user.id,
                name=data['name'],
                date=data['date'],
                time=data['time'],
                guests=data['guests'],
                menuItems=menu_item_ids,
                specialNotes=data['specialNotes']
            )
            db.session.add(reservation)
            db.session.commit()
            return jsonify({"message": "Reservation created successfully"}), 201

    @app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
    def manage_reservation(reservation_id):
        email = request.args.get('email')
        if not email:
            return jsonify({"message": "Email is required"}), 400

        user = get_or_create_user(email, request.json)
        reservation = Reservation.query.get_or_404(reservation_id)

        if reservation.user_id != user.id:
            return jsonify({"message": "Unauthorized"}), 403

        if request.method == 'GET':
            return jsonify(reservation.serialize()), 200

        elif request.method == 'PUT':
            data = request.json
            for key, value in data.items():
                if key != 'user_id':  # Prevent changing the user_id
                    setattr(reservation, key, value)
            db.session.commit()
            return jsonify({"message": "Reservation updated successfully"}), 200

        elif request.method == 'DELETE':
            db.session.delete(reservation)
            db.session.commit()
            return jsonify({"message": "Reservation deleted successfully"}), 200
        
    # Menu items management
    @app.route('/menu_items', methods=['GET', 'POST'])
    def menu_items():
        try:
            if request.method == 'GET':
                items = MenuItem.query.all()
                return jsonify([item.serialize() for item in items]), 200
            elif request.method == 'POST':
                data = request.json
                menu_item = MenuItem(**data)
                db.session.add(menu_item)
                db.session.commit()
                return jsonify({"message": "Menu item added successfully"}), 201
        except Exception as e:
            app.logger.error(f"Error fetching menu items: {e}")
            return jsonify({"message": "Internal Server Error"}), 500

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
