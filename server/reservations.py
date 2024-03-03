from flask import request
from flask_restful import Resource
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import app, db, api
from models import Reservation
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
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
    else:
        return jsonify({'message': 'Method not allowed'}), 405
    return jsonify({'message': 'Reservation retrieved successfully'}), 200

# Initialize JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key
jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(debug=True, port=5555)