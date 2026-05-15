import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductClient from "./ProductClient";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DOMAIN = "https://maestrodeninmluxury.com";

async function getProduct(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data;
  } catch (e) {
    console.error("Error fetching product:", e);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, currentId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, image, category_id, reference')
      .eq('status', 'Activo')
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(40);

    if (error || !data) return [];

    const complementaryCategories: Record<string, string[]> = {
      'chaquetas':      ['pantalones', 'faldas', 'blusas-y-corset'],
      'gabardinas':     ['pantalones', 'faldas', 'blusas-y-corset'],
      'chalecos':       ['pantalones', 'blusas-y-corset'],
      'blusas-y-corset':['pantalones', 'faldas', 'chaquetas'],
      'faldas':         ['blusas-y-corset', 'chaquetas', 'chalecos'],
      'vestidos':       ['chaquetas', 'gabardinas', 'chalecos'],
      'pantalones':     ['blusas-y-corset', 'chaquetas', 'chalecos'],
      'enterizo':       ['chaquetas', 'gabardinas'],
    };

    const preferred    = complementaryCategories[categoryId] || [];
    const complementary = data.filter(p =>  preferred.includes(p.category_id));
    const others        = data.filter(p => !preferred.includes(p.category_id));
    const sorted        = [...complementary, ...others];
    const pool          = sorted.slice(0, Math.min(sorted.length, 9));
    const shuffled      = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  } catch (e) {
    console.error("Error fetching related products:", e);
    return [];
  }
}

// ── Metadata dinámica por producto ──────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Producto | MAESTRO" };

  const name      = product.name || product.reference;
  const price     = Number(product.price).toLocaleString("es-CO");
  const category  = (product.category_id || "").replace(/-/g, " ");
  const desc      = product.description
    || `${name} — Denim premium de lujo. Ref: ${product.reference}. Tallas disponibles: ${(product.sizes || []).join(", ")}.`;
  const image     = product.image || `${DOMAIN}/og-default.jpg`;

  return {
    title:       `${name} | MAESTRO Luxury Denim`,
    description: desc,
    keywords:    [
      name, "denim premium", "jeans de lujo", "moda mujer Colombia",
      category, "maestro denim", product.reference,
    ].filter(Boolean),
    openGraph: {
      title:       `${name} — $${price} COP | MAESTRO`,
      description: desc,
      url:         `${DOMAIN}/product/${id}`,
      siteName:    "MAESTRO Luxury Denim",
      images:      [{ url: image, width: 1200, height: 1500, alt: name }],
      locale:      "es_CO",
      type:        "website",
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${name} | MAESTRO Luxury Denim`,
      description: desc,
      images:      [image],
    },
    alternates: {
      canonical: `${DOMAIN}/product/${id}`,
    },
  };
}

// ── JSON-LD Schema.org para Google Shopping / Rich Results ──
function ProductJsonLd({ product }: { product: any }) {
  const name    = product.name || product.reference;
  const price   = Number(product.price);
  const image   = product.image || `${DOMAIN}/og-default.jpg`;
  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  const images  = [image, ...gallery].filter(Boolean);

  const schema = {
    "@context": "https://schema.org/",
    "@type":    "Product",
    name,
    description: product.description || `${name}. Denim premium de lujo.`,
    image:       images,
    sku:         product.reference,
    brand: {
      "@type": "Brand",
      name:    "MAESTRO Luxury Denim",
    },
    offers: {
      "@type":         "Offer",
      url:             `${DOMAIN}/product/${product.id}`,
      priceCurrency:   "COP",
      price:           price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability:    product.status === "Activo"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name:    "MAESTRO Luxury Denim",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = await params;
  const product   = await getProduct(id);

  if (!product) return notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductClient product={product} related={related} />
    </>
  );
}
