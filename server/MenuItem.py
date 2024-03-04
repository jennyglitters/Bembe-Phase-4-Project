from flask import request
from flask_restful import Resource
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import app, db, api
from models import MenuItem
from flask_migrate import Migrate


db = SQLAlchemy(app)
migrate = Migrate(app, db)
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
    

if __name__ == '__main__':
    app.run(debug=True, port=5555)