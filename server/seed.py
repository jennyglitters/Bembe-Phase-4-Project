#seed.py 
from app import create_app
from models import db, User, MenuItem, Reservation, OrderList
from datetime import datetime, time

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data and create tables
        db.drop_all()
        db.create_all()

        users_data = [
            {"name": "Alice", "lastname": "Green", "email": "alice.green@example.com", "phonenumber": "+15550100234", "password": "password123"},
            {"name": "Bob", "lastname": "Smith", "email": "bob.smith@example.com", "phonenumber": "+15550101234", "password": "password123"},
            # Ensure all phone numbers are in the correct format
        ]
        for user_data in users_data:
            user = User(**user_data) # Password is stored as plain text
            db.session.add(user)

        db.session.commit()

        # Menu Items
        menu_items_data = [
            {"name": "Scallops", "description": "Pan-seared scallops on a butternut squash puree.", "price": 22.66},
            {"name": "Gambas Al Ajillo", "description": "Sautéed shrimp in white wine and garlic.", "price": 17.51},
            # Add more menu items as needed
        ]
        for item_data in menu_items_data:
            menu_item = MenuItem(**item_data)
            db.session.add(menu_item)

        db.session.commit()

        # Reservations
        users = User.query.all()
        for i, user in enumerate(users[:10]):
            # Convert the string to a time object
            reservation_time = datetime.strptime("18:00:00", "%H:%M:%S").time()
            # Placeholder values for name, lastname, email, and phonenumber
            name = "Placeholder Name"
            lastname = "Placeholder Lastname"
            email = "placeholder@example.com"
            phonenumber = "+1234567890"
            reservation = Reservation(user_id=user.id, name=name, lastname=lastname, email=email, phonenumber=phonenumber, date=datetime.utcnow().date(), time=reservation_time, guest_count=2+i, special_notes=f"Special request {i}")
            db.session.add(reservation)
        db.session.commit()

        # OrderLists for linking reservations with menu items
        reservations = Reservation.query.all()
        menu_items = MenuItem.query.all()
        for i, reservation in enumerate(reservations):
            order = OrderList(reservation_id=reservation.id, menu_item_id=menu_items[i % len(menu_items)].id, quantity=1 + i, special_requests=f"Special request {i}")
            db.session.add(order)
        db.session.commit()

        print('Database seeded successfully!')

if __name__ == '__main__':
    seed_data()