import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import ProductClient from "./ProductClient";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DOMAIN = "https://www.maestrodeninmluxury.com";

async function getProduct(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', slug)
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
      .select('id, slug, name, price, image, category_id, reference')
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
  { params }: { params: Promise<{ category: string, slug: string }> }
): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(slug);
  
  if (!product || product.category_id !== category) return { title: "Producto | MAESTRO" };

  const name      = product.name || product.reference;
  const price     = Number(product.price).toLocaleString("es-CO");
  const desc      = product.description
    || `${name} — Denim premium de lujo. Ref: ${product.reference}. Tallas disponibles: ${(product.sizes || []).join(", ")}.`;
  const image     = product.image || `${DOMAIN}/og-default.jpg`;

  return {
    title:       `${name} | MAESTRO Luxury Denim`,
    description: desc,
    keywords:    [
      name, "denim premium", "jeans de lujo", "moda mujer Colombia",
      category.replace(/-/g, " "), "maestro denim", product.reference,
    ].filter(Boolean),
    openGraph: {
      title:       `${name} — $${price} COP | MAESTRO`,
      description: desc,
      url:         `${DOMAIN}/${category}/${slug}`,
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
      canonical: `${DOMAIN}/${category}/${slug}`,
    },
  };
}

// ── JSON-LD Schema.org para Google Shopping / Rich Results ──
function ProductJsonLd({ product, category, slug }: { product: any, category: string, slug: string }) {
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
      url:             `${DOMAIN}/${category}/${slug}`,
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

export default async function ProductPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
  const { category, slug } = await params;
  
  // Lista de categorías válidas para no interferir con otras páginas del sistema
  const validCategories = [
    'chaquetas', 'gabardinas', 'chalecos', 'blusas-y-corset', 
    'faldas', 'vestidos', 'pantalones', 'enterizo', 'ediciones-especiales'
  ];
  
  if (!validCategories.includes(category)) {
    return notFound();
  }

  const product = await getProduct(slug);

  if (!product || product.category_id !== category) return notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  return (
    <>
      <ProductJsonLd product={product} category={category} slug={slug} />
      <ProductClient product={product} related={related} />
    </>
  );
}
