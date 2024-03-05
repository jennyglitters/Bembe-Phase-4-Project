import React, { useState } from 'react';

export const MenuContext = React.createContext();

export const MenuProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <MenuContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </MenuContext.Provider>
  );
};