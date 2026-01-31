import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <MenuContext.Provider value={{ visible, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  return ctx;
}
