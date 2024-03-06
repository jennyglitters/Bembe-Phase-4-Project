import React, { useContext } from 'react';
import { MenuContext } from './MenuContext'; // Import the MenuContext

const Menu = () => {
  const { selectedItems, setSelectedItems } = useContext(MenuContext);

  const handleItemClick = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter(id => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const isItemSelected = (itemId) => {
    return selectedItems.includes(itemId);
  };

  // Modify renderMenuItem to only handle actual selectable items
  const renderMenuItem = (id, name, price, description) => (
    <div
      key={id}
      className={`menu-item ${isItemSelected(id) ? 'selected' : ''}`}
      onClick={() => handleItemClick(id)}
    >
      <h3>{name}</h3>
      {price && <p className="price">{price}</p>}
      <p className="description">{description}</p>
    </div>
  );

  return (
    <div className="menu-container">
      {/* Dinner Section */}
      <div className="menu-section">
        <h2>Dinner</h2>
        {renderMenuItem(1, "Party Bottomless Dinner (per person)", "$66.95", "2 hours of unlimited mixed drinks (think 1 liquor 1 mixer...vodka soda/whiskey ginger/tequila sprite), wine, or sangria includes any 5 dinner menu items. Menu items are adjusted the size to your party and served family style we make sure everyone is fed")}

        {/* Info note rendered outside renderMenuItem, not part of selectable items */}
        <div className="menu-item info">
          <h3>Tapas Style Menu</h3>
          <p className="description">At Bembe we love to share! Everything on our menu is made shareable for your table. We recommend 2-3 dishes per 2 people. If you have any questions, your server can guide you.</p>
        </div>
      </div>

      {/* Mariscos Section */}
      <div className="menu-section">
        <h2>Mariscos</h2>
        {renderMenuItem(3, "Scallops", "$22.66", "Pan-seared scallops on top of a butternut squash puree topped with shaved parmesan and pine nuts.")}
        {renderMenuItem(4, "Gambas Al Ajillo", "$17.51", "Sautéed shrimp in white wine, paprika, crushed red pepper and garlic served over Amy's French Baguette.")}
        {renderMenuItem(5, "Crispy Calamari", "$15.45", "Lightly fried with hints of honey piquillo and lime served with Habanero aioli.")}
      </div>

      {/* Starters & Macs Section */}
      <div className="menu-section">
        <h2>Starters & Macs</h2>
        {renderMenuItem(6, "Plantain & Pork Guacamole", "$7.15", "Our twist on guacamole, served on a bed of mashed plantains and topped with crispy pork bits for a Caribbean flair.")}
        {renderMenuItem(7, "Dominican Fried Cheese Mac", null, "A creamy mac and cheese with a Dominican twist, featuring fried cheese, traditional white cheese, and a breadcrumb topping.")}
        {renderMenuItem(8, "Three-Cheese Caribbean Mac", "$15.45", "Our classic mac and cheese enriched with a trio of Caribbean cheeses, giving it a unique, tropical taste.")}
        {renderMenuItem(9, "Boriqua Lobster Mac", "$18.54", "Lobster mac and cheese inspired by Puerto Rican flavors, with a creamy Creole sauce and a crispy breadcrumb topping.")}
        {renderMenuItem(10, "Truffle & Spinach Caribbean Mac", "$17.51", "Elevate your mac and cheese experience with our truffle and spinach blend, featuring Caribbean cheeses for a tropical touch.")}
        {renderMenuItem(11, "Island BBQ Chicken Mac", "$17.51", "Tender grilled chicken in a sweet and tangy island BBQ sauce, mixed with our signature mac and cheese.")}
        {renderMenuItem(12, "Tropical Vegan Mac", "$16.50", "A dairy-free delight, our vegan mac features a coconut-based cheese sauce, bringing the tropics to your table.")}
        {renderMenuItem(13, "Burrata & Plantain Bites", "$21.63", "Creamy burrata served on crispy plantain bites, complemented by avocado-lime pesto and fresh tomatoes, with a mango balsamic drizzle.")}
        {renderMenuItem(14, "Mushroom & Cassava Croquettes", "$13.39", "A fusion of flavors in every bite, these croquettes combine mushrooms and cassava for a Caribbean twist, served with cilantro and garlic aioli.")}
      </div>

      {/* Carne Section */}
      <div className="menu-section">
        <h2>Carne</h2>
        {renderMenuItem(15, "BBQ Chicken Sliders", "$15.45", "3 pulled chicken sliders with fiery BBQ sauce topped with purple slaw served on Hawaiian rolls")}
        {renderMenuItem(16, "Steak Lollipops", "$18.54", "Grilled skirt steak skewers, melted manchego cheese, chopped bacon, chimichurri sauce")}
      </div>

      {/* House Cocktails Section */}
      <div className="menu-section">
        <h2>HOUSE COCKTAILS</h2>
        {renderMenuItem(17, "Jalapeno Margarita", "$13.39", "Jalapeno-infused tequila, Lime, Orange. +1 to \"Make it 'Skinny'\" with honey")}
        {renderMenuItem(18, "Blood Orange Mango Mojito", "$13.39", "Mango Rum, Mint, Blood Orange, Lime")}
        {renderMenuItem(19, "Bembe Hybrid", "$11.33", "Red and White Sangria, St.Germaine, Blood Orange, Champagne Float")}
        {renderMenuItem(20, "Espresso Martini", "$12.36", "Vodka with a nice day cold brew x Bembe special recipe")}
        {renderMenuItem(21, "Bubbly Mule", "$13.39", "Gin, Ginger, Lemon, Lychee, Champagne")}
      </div>
      
      {/* Beer Section */}
      <div className="menu-section">
        <h2>CERVEZAS</h2>
        {renderMenuItem(22, "Presidente", "$8.24", "Dominican pilsner, crisp and refreshing with a light golden color - 5.0% ABV")}
        {renderMenuItem(23, "Medalla Light", "$7.20", "Puerto Rican light lager, smooth and light with a hint of malt - 4.2% ABV")}
        {renderMenuItem(24, "Guinness Draught", "$9.30", "Irish dry stout, distinctive black color and creamy head - 4.2% ABV")}
        {renderMenuItem(25, "IPA of the Moment", "$10.00", "Ask your server about our current selection of IPA, featuring unique and seasonal options from around the world")}
        {renderMenuItem(26, "Blue Moon", "$7.20", "Belgian-style wheat ale, Valencia orange peel for a subtle sweetness - 5.4% ABV")}
        {renderMenuItem(27, "Brooklyn Lager", "$8.00", "American Amber Lager, firm malt center supported by a refreshing bitterness and floral hop aroma - 5.2% ABV")}
      </div>

      {/* Vino Section */}
      <div className="menu-section">
        <h2>VINO</h2>
        {renderMenuItem(28, "Malbec, Mendoza", "$12 glass / $48 bottle", "Rich and dark with juicy berry flavors and a hint of oak.")}
        {renderMenuItem(29, "Chardonnay, California", "$11 glass / $44 bottle", "Full-bodied with notes of vanilla, butter, and a touch of oak.")}
        {renderMenuItem(30, "Pinot Grigio, Italy", "$10 glass / $40 bottle", "Light and crisp with aromas of lemons, green apples, and honeysuckle.")}
        {renderMenuItem(31, "Sauvignon Blanc, New Zealand", "$12 glass / $48 bottle", "Vibrant and fresh with notes of lime, peach, and tropical fruits.")}
        {renderMenuItem(32, "Cabernet Sauvignon, Napa Valley", "$14 glass / $56 bottle", "Bold and robust with flavors of blackberry, cassis, and cedar.")}
        {renderMenuItem(33, "Prosecco, Italy", "$11 glass / $44 bottle", "Sparkling and light with hints of green apple, honeysuckle, and peach.")}
      </div>

    </div>
    
  );
};

export default Menu;
