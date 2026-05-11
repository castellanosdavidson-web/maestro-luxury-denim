"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  reference: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  totalPrice: number;
  generateWhatsAppLink: () => string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState("573000000000");

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("maestro_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }

    // Fetch dynamic settings (like whatsapp number)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber);
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("maestro_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id && i.size === newItem.size && i.color === newItem.color);
      if (existing) {
        return prev.map((i) => 
          i.id === newItem.id && i.size === newItem.size && i.color === newItem.color 
            ? { ...i, quantity: i.quantity + newItem.quantity } 
            : i
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i)));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateWhatsAppLink = () => {
    const phone = whatsappNumber.replace(/\D/g, ''); // Limpiar el número de espacios o símbolos
    let message = "Hola MAESTRO, me gustaría comprar los siguientes productos:%0A%0A";
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (Ref: ${item.reference})%0A`;
      message += `   Talla: ${item.size} | Color: ${item.color} | Cant: ${item.quantity}%0A`;
    });
    
    message += `%0ATotal: $${totalPrice.toLocaleString("es-CO")}%0A%0A`;
    message += "Quedo atenta. ¡Gracias!";
    
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, isCartOpen, setIsCartOpen, totalItems, totalPrice, generateWhatsAppLink }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
