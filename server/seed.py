from app import create_app, db  # Ensure 'db' is imported from the same place it's initialized
from models import User, MenuItem, Reservation, OrderList
from datetime import datetime

def seed_data():
    # Dropping all tables
    db.drop_all()
    # Creating all tables
    db.create_all()

    user = User(
        name="John Doe",
        lastname="Doe",
        email="johndoe@example.com",
        phonenumber="1234567890",
        password="password"  # This is necessary given your User model's __init__ method
    )
    db.session.add(user)
    db.session.commit()

    # Committing changes to add the user to the database
    db.session.commit()

    # Example Menu Items (simplified for brevity)
    menu_items = [
        {"name": "Scallops", "description": "Pan-seared scallops on top of a butternut squash puree topped with shaved parmesan and pine nuts.", "price": 22.66},
        {"name": "Gambas Al Ajillo", "description": "Sautéed shrimp in white wine, paprika, crushed red pepper and garlic served over Amy's French Baguette.", "price": 17.51},
        {"name": "Crispy Calamari", "description": "Lightly fried with hints of honey piquillo and lime served with Habanero aioli.", "price": 15.45},
        {"name": "Plantain & Pork Guacamole", "description": "Our twist on guacamole, served on a bed of mashed plantains and topped with crispy pork bits for a Caribbean flair.", "price": 7.15},
        {"name": "Dominican Fried Cheese Mac", "description": "A creamy mac and cheese with a Dominican twist, featuring fried cheese, traditional white cheese, and a breadcrumb topping.", "price": 0},
        {"name": "Three-Cheese Caribbean Mac", "description": "Our classic mac and cheese enriched with a trio of Caribbean cheeses, giving it a unique, tropical taste.", "price": 15.45},
        {"name": "Boriqua Lobster Mac", "description": "Lobster mac and cheese inspired by Puerto Rican flavors, with a creamy Creole sauce and a crispy breadcrumb topping.", "price": 18.54},
        {"name": "Truffle & Spinach Caribbean Mac", "description": "Elevate your mac and cheese experience with our truffle and spinach blend, featuring Caribbean cheeses for a tropical touch.", "price": 17.51},
        {"name": "Island BBQ Chicken Mac", "description": "Tender grilled chicken in a sweet and tangy island BBQ sauce, mixed with our signature mac and cheese.", "price": 17.51},
        {"name": "Tropical Vegan Mac", "description": "A dairy-free delight, our vegan mac features a coconut-based cheese sauce, bringing the tropics to your table.", "price": 16.50},
        {"name": "Burrata & Plantain Bites", "description": "Creamy burrata served on crispy plantain bites, complemented by avocado-lime pesto and fresh tomatoes, with a mango balsamic drizzle.", "price": 21.63},
        {"name": "Mushroom & Cassava Croquettes", "description": "A fusion of flavors in every bite, these croquettes combine mushrooms and cassava for a Caribbean twist, served with cilantro and garlic aioli.", "price": 13.39},
        {"name": "BBQ Chicken Sliders", "description": "3 pulled chicken sliders with fiery BBQ sauce topped with purple slaw served on Hawaiian rolls", "price": 15.45},
        {"name": "Steak Lollipops", "description": "Grilled skirt steak skewers, melted manchego cheese, chopped bacon, chimichurri sauce", "price": 18.54},
        {"name": "Jalapeno Margarita", "description": "Jalapeno-infused tequila, Lime, Orange. +1 to 'Make it 'Skinny'' with honey", "price": 13.39},
        {"name": "Blood Orange Mango Mojito", "description": "Mango Rum, Mint, Blood Orange, Lime", "price": 13.39},
        {"name": "Bembe Hybrid", "description": "Red and White Sangria, St.Germaine, Blood Orange, Champagne Float", "price": 11.33},
        {"name": "Espresso Martini", "description": "Vodka with a nice day cold brew x Bembe special recipe", "price": 12.36},
        {"name": "Bubbly Mule", "description": "Gin, Ginger, Lemon, Lychee, Champagne", "price": 13.39},
        {"name": "Presidente", "description": "Dominican pilsner, crisp and refreshing with a light golden color - 5.0% ABV", "price": 8.24},
        {"name": "Medalla Light", "description": "Puerto Rican light lager, smooth and light with a hint of malt - 4.2% ABV", "price": 7.20},
        {"name": "Guinness Draught", "description": "Irish dry stout, distinctive black color and creamy head - 4.2% ABV", "price": 9.30},
        {"name": "IPA of the Moment", "description": "Ask your server about our current selection of IPA, featuring unique and seasonal options from around the world", "price": 10.00},
        {"name": "Blue Moon", "description": "Belgian-style wheat ale, Valencia orange peel for a subtle sweetness - 5.4% ABV", "price": 7.20},
        {"name": "Brooklyn Lager", "description": "American Amber Lager, firm malt center supported by a refreshing bitterness and floral hop aroma - 5.2% ABV", "price": 8.00},
        {"name": "Malbec, Mendoza", "description": "Rich and dark with juicy berry flavors and a hint of oak.", "price": 12},
        {"name": "Chardonnay, California", "description": "Full-bodied with notes of vanilla, butter, and a touch of oak.", "price": 11},
        {"name": "Pinot Grigio, Italy", "description": "Light and crisp with aromas of lemons, green apples, and honeysuckle.", "price": 10},
        {"name": "Sauvignon Blanc, New Zealand", "description": "Vibrant and fresh with notes of lime, peach, and tropical fruits.", "price": 12},
        {"name": "Cabernet Sauvignon, Napa Valley", "description": "Bold and robust with flavors of blackberry, cassis, and cedar.", "price": 14},
        {"name": "Prosecco, Italy", "description": "Sparkling and light with hints of green apple, honeysuckle, and peach.", "price": 11}
    ]


    menu_items = [MenuItem(**item_data) for item_data in menu_items]  # Create MenuItem instances

    # Adding Menu Items to the session
    for item in menu_items:
        db.session.add(item)

    # Committing changes to add menu items to the database
    db.session.commit()

    # Example Reservation (using the first user as reference)
    reservation = Reservation(
        name=user.name,
        lastname=user.lastname,
        email=user.email,
        phonenumber=user.phonenumber,
        date=datetime.utcnow(),
        time=datetime.utcnow().time(),
        guest_count=4,
        user_id=user.id,
        special_notes="No special notes"
    )
    db.session.add(reservation)

    # Committing changes to add the reservation to the database
    db.session.commit()

    print("Database seeded successfully!")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.drop_all()  # Reset the database every time the script is run
        db.create_all()
        seed_data()
        print("Database seeded successfully!")