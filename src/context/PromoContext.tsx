"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type PromoContextType = {
  promo50Off: boolean;
  promo2x1: boolean;
  isLoading: boolean;
};

const PromoContext = createContext<PromoContextType>({
  promo50Off: false,
  promo2x1: false,
  isLoading: true,
});

export const PromoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promos, setPromos] = useState({
    promo_50_off: false,
    promo_2x1: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/promotions?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          setPromos({
            promo_50_off: Boolean(data.promo_50_off),
            promo_2x1: Boolean(data.promo_2x1),
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <PromoContext.Provider value={{ 
      promo50Off: promos.promo_50_off, 
      promo2x1: promos.promo_2x1,
      isLoading
    }}>
      {children}
    </PromoContext.Provider>
  );
};

export const usePromos = () => useContext(PromoContext);
