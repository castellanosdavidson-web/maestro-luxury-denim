// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  lib/analytics.ts
//  Wrapper seguro de gtag para GA4 + GTM
//  Uso: import { gtagEvent, gtagViewItem, gtagAddToCart } from '@/lib/analytics'
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/** Envía un evento personalizado a GA4 */
export function gtagEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  // Fallback via dataLayer (GTM)
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

// â”€â”€â”€ Eventos estándar GA4 Ecommerce â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Se llama al abrir la página de un producto */
export function gtagViewItem(product: {
  id: string;
  name: string;
  category?: string;
  price: number;
}) {
  gtagEvent("view_item", {
    currency: "COP",
    value: product.price,
    items: [
      {
        item_id:       product.id,
        item_name:     product.name,
        item_category: product.category ?? "Denim",
        price:         product.price,
        quantity:      1,
      },
    ],
  });
}

/** Se llama al agregar un producto al carrito */
export function gtagAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  category?: string;
}) {
  gtagEvent("add_to_cart", {
    currency: "COP",
    value: item.price * item.quantity,
    items: [
      {
        item_id:        item.id,
        item_name:      item.name,
        item_variant:   item.size ? `${item.size} / ${item.color}` : undefined,
        item_category:  item.category ?? "Denim",
        price:          item.price,
        quantity:       item.quantity,
      },
    ],
  });
}

/** Se llama al abrir el carrito (begin_checkout) */
export function gtagViewCart(cartItems: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}[], total: number) {
  gtagEvent("view_cart", {
    currency: "COP",
    value: total,
    items: cartItems.map(i => ({
      item_id:   i.id,
      item_name: i.name,
      price:     i.price,
      quantity:  i.quantity,
    })),
  });
}

/** Se llama al hacer clic en "Comprar por WhatsApp" */
export function gtagBeginCheckout(cartItems: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}[], total: number) {
  gtagEvent("begin_checkout", {
    currency: "COP",
    value: total,
    items: cartItems.map(i => ({
      item_id:   i.id,
      item_name: i.name,
      price:     i.price,
      quantity:  i.quantity,
    })),
  });
}

/** Se llama al hacer clic en cualquier producto (select_item) */
export function gtagSelectItem(product: {
  id: string;
  name: string;
  price?: number;
  category?: string;
}) {
  gtagEvent("select_item", {
    items: [
      {
        item_id:       product.id,
        item_name:     product.name,
        item_category: product.category ?? "Denim",
        price:         product.price,
      },
    ],
  });
}
