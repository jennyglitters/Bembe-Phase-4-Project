
from app import app
from models import db, User, MenuItem, Reservation
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from config import app, db

if __name__ == '__main__':
    with app.app_context():
        print("Seeding data...")
        
        User.query.delete()
        MenuItem.query.delete()
        Reservation.query.delete()

        print("Seeding tables...")

        user1 = User(User='username', name='Alice', lastname='Green', email='alice.green@example.com', phonenumber='+15550100234')
        db.session.add(user1)
        db.session.commit()

        menu_items=MenuItem(name='Dominican Fried Cheese Mac', description= 'A creamy mac and cheese with a Dominican twist, featuring fried cheese, traditional white cheese, and a breadcrumb topping', price= 22.66)
        db.session.add(menu_items)
        db.session.commit()

        reservation_1 = Reservation(name='John', lastname= 'Doe', email= 'john.doe@example.com', phonenumber='+155501002', date=datetime.utcnow().date(), time=datetime.utcnow().time(), special_notes= "Special request 1", user_id=user1.id)
        db.session.add(reservation_1)
        db.session.commit()



        # # Users
        # user_data = {
        #     'User': 'username',
        #     'name': 'Alice',
        #     'lastname': 'Green',
        #     'email': 'alice.green@example.com',
        #     'phonenumber': '+15550100234'
        # }
        # db.session.add(user)
        # db.session.commit()

        # # Menu Items
        # menu_items_data = [
        #     {"name": "Scallops", "description": "Pan-seared scallops on a butternut squash puree.", "price": 22.66},
        #     {"name": "Gambas Al Ajillo", "description": "Sautéed shrimp in white wine and garlic.", "price": 17.51},
        #     # Add more menu items as needed
        # ]
        # for item_data in menu_items_data:
        #     menu_item = MenuItem(**item_data)
        #     db.session.add(menu_item)

        # db.session.commit()
        # # Reservations
        # users = User.query.all()
        # for i, user in enumerate(users[:10]):
        #     reservation_time = datetime.strptime("18:00:00", "%H:%M:%S").time()
        #     reservation = Reservation(user_id=user.id, date=datetime.utcnow().date(), time=reservation_time, guests=2+i, special_notes=f"Special request {i}")
        #     db.session.add(reservation)
        # db.session.commit()

        # # Link reservations with menu items
        # reservations = Reservation.query.all()
        # menu_items = MenuItem.query.all()
        # for i, reservation in enumerate(reservations):
        #     for j in range(i % len(menu_items)):
        #         reservation.menu_items.append(menu_items[j])
        # db.session.commit()

        #print('Database seeded successfully!')

