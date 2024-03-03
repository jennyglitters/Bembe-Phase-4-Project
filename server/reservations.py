from flask import request
from flask_restful import Resource
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import app, db, api
from models import Reservation

@app.route('/api/reservations/<int:reservation_id>', methods=['GET', 'PUT', 'DELETE'])
def reservation(reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    
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
    
    # Routes for Reservations
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