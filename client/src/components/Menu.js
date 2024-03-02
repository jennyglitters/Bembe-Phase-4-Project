import React from 'react';

const Menu = () => {
  return (
    <div className="menu-container">

      {/* Dinner Section */}
      <div className="menu-section">
        <h2>Dinner</h2>

        <div className="menu-item">
          <h3>Party Bottomless Dinner (per person)</h3>
          <p className="price">$66.95</p>
          <p className="description">2 hours of unlimited mixed drinks (think 1 liquor 1 mixer...vodka soda/whiskey ginger/tequila sprite), wine, or sangria includes any 5 dinner menu items. Menu items are adjusted the size to your party and served family style we make sure everyone is fed</p>
        </div>

        <div className="menu-item">
          <h3>Tapas Style Menu</h3>
          <p className="description">At Bembe we love to share! Everything on our menu is made shareable for your table we recommend 2-3 dishes per 2 people if you have any questions your server can guide you</p>
        </div>
      </div>

      {/* Mariscos Section */}
      <div className="menu-section">
        <h2>Mariscos</h2>

        <div className="menu-item">
          <h3>Scallops</h3>
          <p className="price">$22.66</p>
          <p className="description">Pan-seared scallops on top of a butternut squash puree topped with shaved parmesan and pine nuts.</p>
        </div>

        <div className="menu-item">
          <h3>Gambas Al Ajillo</h3>
          <p className="price">$17.51</p>
          <p className="description">Sautéed shrimp in white wine, paprika, crushed red pepper and garlic served over Amy's French Baguette.</p>
        </div>

        <div className="menu-item">
          <h3>Crispy Calamari</h3>
          <p className="price">$15.45</p>
          <p className="description">Lightly fried with hints of honey piquillo and lime served with Habanero aioli.</p>
        </div>
      </div>

      {/* Starters & Macs Section */}
      <div className="menu-section">
        <h2>Starters & Macs</h2>

        <div className="menu-item">
          <h3>Guacamole</h3>
          <p className="price">$7.15</p>
          <p className="description">Traditional guacamole served with fresh tortilla chips.</p>
        </div>

        <div className="menu-item">
          <h3>Poco Macs</h3>
          <p className="description">Shell pasta, our signature 3 cheese blend and panko breadcrumbs.</p>
        </div>

        <div className="menu-item">
          <h3>Three Cheese</h3>
          <p className="price">$15.45</p>
          <p className="description">Shell pasta, our signature 3 cheese blend and panko breadcrumbs.</p>
        </div>

        <div className="menu-item">
          <h3>Lobster</h3>
          <p className="price">$18.54</p>
          <p className="description">Shell pasta with our signature 3 cheese blend, panko breadcrumbs, and fresh lobster.</p>
        </div>

        <div className="menu-item">
          <h3>Spinach & Truffle</h3>
          <p className="price">$17.51</p>
          <p className="description">Creamy truffle mac with sautéed spinach mixed into our three cheese blend and shell pasta.</p>
        </div>

        <div className="menu-item">
          <h3>BBQ Chicken</h3>
          <p className="price">$17.51</p>
          <p className="description">Grilled chicken breast, our signature 3 cheese blend, panko breadcrumbs, and a drizzle of BBQ sauce.</p>
        </div>

        <div className="menu-item">
          <h3>Vegan Mac</h3>
          <p className="price">$16.50</p>
          <p className="description">A dairy-free alternative with a rich, creamy vegan cheese sauce and shell pasta.</p>
        </div>

        <div className="menu-item">
          <h3>Burrata</h3>
          <p className="price">$21.63</p>
          <p className="description">Fresh burrata on Amy’s sourdough with pesto and heirloom tomatoes drizzled with balsamic glaze.</p>
        </div>

        <div className="menu-item">
          <h3>Mushroom Croquette</h3>
          <p className="price">$13.39</p>
          <p className="description">Mushroom risotto with truffle oil in 3 croquettes topped with truffle aioli.</p>
        </div>
      </div>

      {/* Carne Section */}
      <div className="menu-section">
        <h2>Carne</h2>

        <div className="menu-item">
          <h3>BBQ Chicken Sliders</h3>
          <p className="price">$15.45</p>
          <p className="description">3 pulled chicken sliders with fiery BBQ sauce topped with purple slaw served on Hawaiian rolls</p>
        </div>

        <div className="menu-item">
          <h3>Steak Lollipops</h3>
          <p className="price">$18.54</p>
          <p className="description">Grilled skirt steak skewers, melted manchego cheese, chopped bacon, chimichurri sauce</p>
        </div>
      </div>

      {/* House Cocktails Section */}
    <div className="menu-section">
    <h2>HOUSE COCKTAILS</h2>
    
    <div className="menu-item">
        <h3>Jalapeno Margarita</h3>
        <p className="price">$13.39</p>
        <p className="description">Jalapeno-infused tequila, Lime, Orange. +1 to "Make it 'Skinny'" with honey</p>
    </div>
    
    <div className="menu-item">
        <h3>Blood Orange Mango Mojito</h3>
        <p className="price">$13.39</p>
        <p className="description">Mango Rum, Mint, Blood Orange, Lime</p>
    </div>
    
    <div className="menu-item">
        <h3>Poco Hybrid</h3>
        <p className="price">$11.33</p>
        <p className="description">Red and White Sangria, St.Germaine, Blood Orange, Champagne Float</p>
    </div>
    
    <div className="menu-item">
        <h3>Espresso Martini</h3>
        <p className="price">$12.36</p>
        <p className="description">Vodka with a nice day cold brew x poco special recipe</p>
    </div>
    
    <div className="menu-item">
        <h3>Bubbly Mule</h3>
        <p className="price">$13.39</p>
        <p className="description">Gin, Ginger, Lemon, Lychee, Champagne</p>
    </div>
        </div>

    {/* Beer Section */}
    <div className="menu-section">
    <h2>BEER</h2>
    
    <div className="menu-item">
        <h3>Yuengling Lager</h3>
        <p className="price">$8.24</p>
        <p className="description">Rich amber color and medium-bodied flavor - 4.5% ABV</p>
    </div>
    
    <div className="menu-item">
        <h3>Blue Moon</h3>
        <p className="price">$7.20</p>
        <p className="description">Belgian-style wheat ale, Valencia orange peel for a subtle sweetness - 5.4% ABV</p>
    </div>
    
    <div className="menu-item">
        <h3>Guinness Draught</h3>
        <p className="price">$9.30</p>
        <p className="description">Irish dry stout, distinctive black color and creamy head - 4.2% ABV</p>
    </div>
    
    <div className="menu-item">
        <h3>IPA of the Moment</h3>
        <p className="price">$10.00</p>
        <p className="description">Ask your server about our current selection of IPA</p>
    </div>
    
    <div className="menu-item">
        <h3>Brooklyn Lager</h3>
        <p className="price">$8.00</p>
        <p className="description">American Amber Lager, firm malt center supported by a refreshing bitterness and floral hop aroma - 5.2% ABV</p>
    </div>
    
    <div className="menu-item">
        <h3>Stella Artois</h3>
        <p className="price">$8.50</p>
        <p className="description">Belgian pilsner, well-balanced flavors with a hint of bitterness - 5.0% ABV</p>
    </div>
    </div>

    {/* Vino Section */}
    <div className="menu-section">
    <h2>VINO</h2>
    
    <div className="menu-item">
        <h3>Malbec, Mendoza</h3>
        <p className="price">$12 glass / $48 bottle</p>
        <p className="description">Rich and dark with juicy berry flavors and a hint of oak.</p>
    </div>
    
    <div className="menu-item">
        <h3>Chardonnay, California</h3>
        <p className="price">$11 glass / $44 bottle</p>
        <p className="description">Full-bodied with notes of vanilla, butter, and a touch of oak.</p>
    </div>
    
    <div className="menu-item">
        <h3>Pinot Grigio, Italy</h3>
        <p className="price">$10 glass / $40 bottle</p>
        <p className="description">Light and crisp with aromas of lemons, green apples, and honeysuckle.</p>
    </div>
    
    <div className="menu-item">
        <h3>Sauvignon Blanc, New Zealand</h3>
        <p className="price">$12 glass / $48 bottle</p>
        <p className="description">Vibrant and fresh with notes of lime, peach, and tropical fruits.</p>
    </div>
    
    <div className="menu-item">
        <h3>Cabernet Sauvignon, Napa Valley</h3>
        <p className="price">$14 glass / $56 bottle</p>
        <p className="description">Bold and robust with flavors of blackberry, cassis, and cedar.</p>
    </div>
    
    <div className="menu-item">
          <h3>Prosecco, Italy</h3>
          <p className="price">$11 glass / $44 bottle</p>
          <p className="description">Sparkling and light with hints of green apple, honeysuckle, and peach.</p>
        </div>
      </div>
    </div> 
  ); 
};

export default Menu; 
