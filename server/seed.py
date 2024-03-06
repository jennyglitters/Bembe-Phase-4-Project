#seed.py 
from app import create_app
from models import db, Users, MenuItem, Reservation
from datetime import datetime

app = create_app()

def seed_data():
    with app.app_context():  # This will push an application context
        # Clear existing data and create tables
        db.drop_all()
        db.create_all()

        # Create some users
        user1 = Users(user_email='john@example.com')
        user1.set_password('password123')  # Set password correctly using bcrypt
        user2 = Users(user_email='jane@example.com')
        user2.set_password('password456')  # Set password correctly using bcrypt
        db.session.add(user1)
        db.session.add(user2)

        # Create some menu items
        item1 = MenuItem(name='Pancakes', description='Fluffy pancakes with syrup', price=7.99)
        item2 = MenuItem(name='Salad', description='Fresh green salad', price=9.99)
        db.session.add(item1)
        db.session.add(item2)

        # Ensure the objects are persisted to the database to generate IDs
        db.session.commit()

        # Create some reservations
        reservation1 = Reservation(user_id=user1.id, date_time=datetime.utcnow(), guest_size=2)
        reservation1.menu_items.append(item1)
        reservation1.menu_items.append(item2)

        reservation2 = Reservation(user_id=user2.id, date_time=datetime.utcnow(), guest_size=4)
        reservation2.menu_items.append(item2)

        db.session.add(reservation1)
        db.session.add(reservation2)

        db.session.commit()

        print('Database seeded successfully!')

if __name__ == '__main__':
    seed_data()

