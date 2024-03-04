#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from model import db, Users, Menu, Reservation
if __name__ == '__main__':
def seed_data():

Create some users
user1 = Users(username='John', useremail='john@example.com', userpassword='password123')
user2 = Users(username='Jane', useremail='jane@example.com', userpassword='password456')
db.session.add(user1)
db.session.add(user2)
db.session.commit()

Create some menus
menu1 = Menu(name='Breakfast', description='Delicious breakfast options', price=10.99)
menu2 = Menu(name='Lunch', description='Healthy lunch choices', price=15.99)
db.session.add(menu1)
db.session.add(menu2)
db.session.commit()

Create some reservations
reservation1 = Reservation(firstname='John', lastname='Doe', notes='Table for two', phonenumber='1234567890', email='john@example.com', user=user1, menu=menu1)
reservation2 = Reservation(firstname='Jane', lastname='Doe', notes='Table for four', phonenumber='9876543210', email='jane@example.com', user=user2, menu=menu2)
db.session.add(reservation1)
db.session.add(reservation2)
db.session.commit()

print('Database seeded successfully!')

if name == 'main':
seed_data()