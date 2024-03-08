from flask import request, make_response
from flask_restful import Resource
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from models import db, User, MenuItem, Reservation
import os
from config import app, db

@app.route('/reservations', methods=['GET', 'POST'])
def handle_reservations():
    if request.method == 'GET':
        # Get all reservations for the current user
        user_email = request.args.get('email')
        if not user_email:
            return jsonify({"message": "Email is required"}), 400

        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        reservations = Reservation.query.filter_by(user_id=user.id).all()
        return jsonify([reservation.serialize() for reservation in reservations]), 200

    elif request.method == 'POST':
        # Create a new reservation
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        new_reservation = Reservation(**data)
        db.session.add(new_reservation)
        db.session.commit()
        return jsonify(new_reservation.serialize()), 201

@app.route('/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_reservation(reservation_id):
    user_email = request.args.get('email')
    if not user_email:
        return jsonify({"message": "Email is required"}), 400


    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    reservation = Reservation.query.get_or_404(reservation_id)

    if reservation.user_id != user.id:
        return jsonify({"message": "Unauthorized"}), 403


    if request.method == 'GET':
        # Get a specific reservation
        return jsonify(reservation.serialize()), 200

    elif request.method == 'PUT':
        # Update a specific reservation
        data = request.get_json()
        for key, value in data.items():
            if key != 'user_id': # Prevent changing the user_id
                setattr(reservation, key, value)
        db.session.commit()
        return jsonify(reservation.serialize()), 200
    elif request.method == 'DELETE':
        # Delete a specific reservation
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Reservation deleted successfully"}), 200


@app.route('/menu_items', methods=['GET', 'POST'])
def menu_items():
    if request.method == 'GET':
        items = MenuItem.query.all()
        return jsonify([item.serialize() for item in items]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_item = MenuItem(**data)
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.serialize()), 201

@app.route('/menu_items/<int:menu_item_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_menu_item(menu_item_id):
    menu_item = MenuItem.query.get_or_404(menu_item_id)
    if request.method == 'GET':
        return jsonify(menu_item.serialize()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        for key, value in data.items():
            setattr(menu_item, key, value)
        db.session.commit()
        return jsonify(menu_item.serialize()), 200
    elif request.method == 'DELETE':
        db.session.delete(menu_item)
        db.session.commit()
        return jsonify({"message": "Menu item deleted successfully"}), 200


if __name__ == '__main__':
    app.run(port=5555, debug=True)
