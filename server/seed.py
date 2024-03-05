#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Users, Menu, Reservation

app = create_app()

def seed_data():
    with app.app_context():  # This will push an application context
        # Create some users
        user1 = Users(username='John', user_email='john@example.com', user_password='password123')
        user2 = Users(username='Jane', user_email='jane@example.com', user_password='password456')
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        # Create some menus
        menu1 = Menu(name='Breakfast', description='Delicious breakfast options', price=10.99)
        menu2 = Menu(name='Lunch', description='Healthy lunch choices', price=15.99)
        db.session.add(menu1)
        db.session.add(menu2)
        db.session.commit()

        # Create some reservations
        reservation1 = Reservation(first_name='John', last_name='Doe', notes='Table for two', phone_number='1234567890', email='john@example.com', date=datetime.utcnow(), date_time=datetime.utcnow(), user_id=user1.id, menu_id=menu1.id)
        reservation2 = Reservation(first_name='Jane', last_name='Doe', notes='Table for four', phone_number='9876543210', email='jane@example.com', date=datetime.utcnow(), date_time=datetime.utcnow(), user_id=user2.id, menu_id=menu2.id)
        db.session.add(reservation1)
        db.session.add(reservation2)
        db.session.commit()

        print('Database seeded successfully!')

if __name__ == '__main__':
    seed_data()