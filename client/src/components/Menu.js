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
        {renderMenuItem(6, "Guacamole", "$7.15", "Traditional guacamole served with fresh tortilla chips.")}
        {renderMenuItem(7, "Bembe Macs", null, "Shell pasta, our signature 3 cheese blend and panko breadcrumbs.")}
        {renderMenuItem(8, "Three Cheese", "$15.45", "Shell pasta, our signature 3 cheese blend and panko breadcrumbs.")}
        {renderMenuItem(9, "Lobster", "$18.54", "Shell pasta with our signature 3 cheese blend, panko breadcrumbs, and fresh lobster.")}
        {renderMenuItem(10, "Spinach & Truffle", "$17.51", "Creamy truffle mac with sautéed spinach mixed into our three cheese blend and shell pasta.")}
        {renderMenuItem(11, "BBQ Chicken", "$17.51", "Grilled chicken breast, our signature 3 cheese blend, panko breadcrumbs, and a drizzle of BBQ sauce.")}
        {renderMenuItem(12, "Vegan Mac", "$16.50", "A dairy-free alternative with a rich, creamy vegan cheese sauce and shell pasta.")}
        {renderMenuItem(13, "Burrata", "$21.63", "Fresh burrata on Amy’s sourdough with pesto and heirloom tomatoes drizzled with balsamic glaze.")}
        {renderMenuItem(14, "Mushroom Croquette", "$13.39", "Mushroom risotto with truffle oil in 3 croquettes topped with truffle aioli.")}
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
        {renderMenuItem(20, "Espresso Martini", "$12.36", "Vodka with a nice day cold brew x poco special recipe")}
        {renderMenuItem(21, "Bubbly Mule", "$13.39", "Gin, Ginger, Lemon, Lychee, Champagne")}
      </div>
      
      {/* Beer Section */}
      <div className="menu-section">
        <h2>BEER</h2>
        {renderMenuItem(22, "Yuengling Lager", "$8.24", "Rich amber color and medium-bodied flavor - 4.5% ABV")}
        {renderMenuItem(23, "Blue Moon", "$7.20", "Belgian-style wheat ale, Valencia orange peel for a subtle sweetness - 5.4% ABV")}
        {renderMenuItem(24, "Guinness Draught", "$9.30", "Irish dry stout, distinctive black color and creamy head - 4.2% ABV")}
        {renderMenuItem(25, "IPA of the Moment", "$10.00", "Ask your server about our current selection of IPA")}
        {renderMenuItem(26, "Brooklyn Lager", "$8.00", "American Amber Lager, firm malt center supported by a refreshing bitterness and floral hop aroma - 5.2% ABV")}
        {renderMenuItem(27, "Stella Artois", "$8.50", "Belgian pilsner, well-balanced flavors with a hint of bitterness - 5.0% ABV")}
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
