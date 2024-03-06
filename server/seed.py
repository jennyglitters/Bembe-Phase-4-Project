from app import create_app
from models import db, User, MenuItem, Reservation, OrderList
from datetime import datetime

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data and create tables
        db.drop_all()
        db.create_all()

        # Users
        names = ["Alice Green", "Bob Smith", "Charlie Johnson", "Dana Lee", "Evan Wright",
                 "Fiona Harris", "George King", "Hannah Scott", "Ian Turner", "Jenna Brown",
                 "Kyle Adams", "Lena Miller", "Miles White", "Nora Davis"]
        users = []
        for i, full_name in enumerate(names):
            first_name, last_name = full_name.split()
            email = f"{first_name.lower()}.{last_name.lower()}@example.com"
            user = User(email=email, name=first_name, lastname=last_name, phonenumber=f"555-010{i:02d}")
            # Placeholder for setting the user's password correctly
            user.set_password(f"password{i:03d}")
            users.append(user)
            db.session.add(user)

        # Menu Items from Menu.js
        menu_items = [
            MenuItem(name="Scallops", description="Pan-seared scallops on top of a butternut squash puree topped with shaved parmesan and pine nuts.", price=22.66),
            MenuItem(name="Gambas Al Ajillo", description="Sautéed shrimp in white wine, paprika, crushed red pepper and garlic served over Amy's French Baguette.", price=17.51),
            MenuItem(name="Crispy Calamari", description="Lightly fried with hints of honey piquillo and lime served with Habanero aioli.", price=15.45),
            MenuItem(name="Plantain & Pork Guacamole", description="Our twist on guacamole, served on a bed of mashed plantains and topped with crispy pork bits for a Caribbean flair.", price=7.15),
            MenuItem(name="Dominican Fried Cheese Mac", description="A creamy mac and cheese with a Dominican twist, featuring fried cheese, traditional white cheese, and a breadcrumb topping.", price=0),
            MenuItem(name="Three-Cheese Caribbean Mac", description="Our classic mac and cheese enriched with a trio of Caribbean cheeses, giving it a unique, tropical taste.", price=15.45),
            MenuItem(name="Boriqua Lobster Mac", description="Lobster mac and cheese inspired by Puerto Rican flavors, with a creamy Creole sauce and a crispy breadcrumb topping.", price=18.54),
            MenuItem(name="Truffle & Spinach Caribbean Mac", description="Elevate your mac and cheese experience with our truffle and spinach blend, featuring Caribbean cheeses for a tropical touch.", price=17.51),
            MenuItem(name="Island BBQ Chicken Mac", description="Tender grilled chicken in a sweet and tangy island BBQ sauce, mixed with our signature mac and cheese.", price=17.51),
            MenuItem(name="Tropical Vegan Mac", description="A dairy-free delight, our vegan mac features a coconut-based cheese sauce, bringing the tropics to your table.", price=16.50),
            MenuItem(name="Burrata & Plantain Bites", description="Creamy burrata served on crispy plantain bites, complemented by avocado-lime pesto and fresh tomatoes, with a mango balsamic drizzle.", price=21.63),
            MenuItem(name="Mushroom & Cassava Croquettes", description="A fusion of flavors in every bite, these croquettes combine mushrooms and cassava for a Caribbean twist, served with cilantro and garlic aioli.", price=13.39),
            MenuItem(name="BBQ Chicken Sliders", description="3 pulled chicken sliders with fiery BBQ sauce topped with purple slaw served on Hawaiian rolls", price=15.45),
            MenuItem(name="Steak Lollipops", description="Grilled skirt steak skewers, melted manchego cheese, chopped bacon, chimichurri sauce", price=18.54),
            MenuItem(name="Jalapeno Margarita", description="Jalapeno-infused tequila, Lime, Orange. +1 to 'Make it 'Skinny'' with honey", price=13.39),
            MenuItem(name="Blood Orange Mango Mojito", description="Mango Rum, Mint, Blood Orange, Lime", price=13.39),
            MenuItem(name="Bembe Hybrid", description="Red and White Sangria, St.Germaine, Blood Orange, Champagne Float", price=11.33),
            MenuItem(name="Espresso Martini", description="Vodka with a nice day cold brew x Bembe special recipe", price=12.36),
            MenuItem(name="Bubbly Mule", description="Gin, Ginger, Lemon, Lychee, Champagne", price=13.39),
            MenuItem(name="Presidente", description="Dominican pilsner, crisp and refreshing with a light golden color - 5.0% ABV", price=8.24),
            MenuItem(name="Medalla Light", description="Puerto Rican light lager, smooth and light with a hint of malt - 4.2% ABV", price=7.20),
            MenuItem(name="Guinness Draught", description="Irish dry stout, distinctive black color and creamy head - 4.2% ABV", price=9.30),
            MenuItem(name="IPA of the Moment", description="Ask your server about our current selection of IPA, featuring unique and seasonal options from around the world", price=10.00),
            MenuItem(name="Blue Moon", description="Belgian-style wheat ale, Valencia orange peel for a subtle sweetness - 5.4% ABV", price=7.20),
            MenuItem(name="Brooklyn Lager", description="American Amber Lager, firm malt center supported by a refreshing bitterness and floral hop aroma - 5.2%, ABV", price=8.00),
            MenuItem(name="Malbec, Mendoza", description="Rich and dark with juicy berry flavors and a hint of oak.", price=12),
            MenuItem(name="Chardonnay, California", description="Full-bodied with notes of vanilla, butter, and a touch of oak.", price=11),
            MenuItem(name="Pinot Grigio, Italy", description="Light and crisp with aromas of lemons, green apples, and honeysuckle.", price=10),
            MenuItem(name="Sauvignon Blanc, New Zealand", description="Vibrant and fresh with notes of lime, peach, and tropical fruits.", price=12),
            MenuItem(name="Cabernet Sauvignon, Napa Valley", description="Bold and robust with flavors of blackberry, cassis, and cedar.", price=14),
            MenuItem(name="Prosecco, Italy", description="Sparkling and light with hints of green apple, honeysuckle, and peach.", price=11)
        ]

        for item in menu_items:
            db.session.add(item)

        db.session.commit()

        # Reservations
        reservations = []
        for i, user in enumerate(users[:10]):
            reservation = Reservation(user_id=user.id, date=datetime.utcnow().date(), time="18:00:00", guest_count=2+i, special_notes=f"Special request {i}")
            reservations.append(reservation)
            db.session.add(reservation)
        db.session.commit()

         # OrderLists for linking reservations with menu items
        for i, reservation in enumerate(reservations):
            # Assign menu items to reservations. Each reservation will have a different menu item, with an increasing quantity and a custom special request
            # Example: linking each reservation to a menu item, with an increasing quantity and a custom special request
            order = OrderList(reservation_id=reservation.id, menu_item_id=menu_items[i % len(menu_items)].id, quantity=1 + i, special_requests=f"Special request {i}")
            db.session.add(order)
        db.session.commit()

        print('Database seeded successfully!')

if __name__ == '__main__':
    seed_data()

