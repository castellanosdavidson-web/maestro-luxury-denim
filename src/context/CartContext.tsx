"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { gtagAddToCart, gtagViewCart } from "@/lib/analytics";
import { usePromos } from "@/context/PromoContext";

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
  originalTotal: number;
  discountTotal: number;
  generateWhatsAppLink: () => string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { promo50Off, promo2x1 } = usePromos();

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
    // GA4: add_to_cart
    gtagAddToCart({
      id:       newItem.id,
      name:     newItem.name,
      price:    newItem.price,
      quantity: newItem.quantity,
      size:     newItem.size,
      color:    newItem.color,
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
  
  let totalPrice = 0;
  let originalTotal = 0;
  let discountTotal = 0;

  if (promo2x1) {
    const flatItems: number[] = [];
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        flatItems.push(item.price);
      }
    });
    flatItems.sort((a, b) => b - a); // Mayor a menor
    totalPrice = flatItems.reduce((sum, price, index) => {
      return sum + (index % 2 === 0 ? price : 0); // Paga los pares (0, 2, 4...) que son los más caros
    }, 0);
    originalTotal = flatItems.reduce((sum, price) => sum + price, 0);
    discountTotal = originalTotal - totalPrice;
  } else if (promo50Off) {
    originalTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPrice = originalTotal / 2;
    discountTotal = originalTotal / 2;
  } else {
    originalTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPrice = originalTotal;
    discountTotal = 0;
  }

  const generateWhatsAppLink = () => {
    const phone = whatsappNumber.replace(/\D/g, ''); // Limpiar el número de espacios o símbolos
    let message = "Hola MAESTRO, me gustaría comprar los siguientes productos:%0A%0A";
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (Ref: ${item.reference})%0A`;
      message += `   Talla: ${item.size} | Color: ${item.color} | Cant: ${item.quantity}%0A`;
      if (promo50Off) {
        message += `   Precio Orig: $${item.price.toLocaleString("es-CO")} | Con 50%: $${(item.price / 2).toLocaleString("es-CO")}%0A`;
      } else {
        message += `   Precio: $${item.price.toLocaleString("es-CO")}%0A`;
      }
    });
    
    message += `%0A`;
    if (promo2x1) {
      message += `🔥 Promoción 2x1 Aplicada 🔥%0A`;
    }
    if (promo50Off) {
      message += `🔥 Descuento 50% Aplicado 🔥%0A`;
    }
    if (discountTotal > 0) {
      message += `Subtotal original: $${originalTotal.toLocaleString("es-CO")}%0A`;
      message += `Descuento: -$${discountTotal.toLocaleString("es-CO")}%0A`;
    }
    message += `*TOTAL A PAGAR: $${totalPrice.toLocaleString("es-CO")}*%0A%0A`;
    message += "Quedo atenta. ¡Gracias!";
    
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, isCartOpen, setIsCartOpen, totalItems, totalPrice, originalTotal, discountTotal, generateWhatsAppLink }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
