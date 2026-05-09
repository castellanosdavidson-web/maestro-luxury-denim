import { readDb } from "@/lib/localDb";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  
  const product = db.products.find(p => p.id === id);
  
  if (!product) {
    return notFound();
  }

  return <ProductClient product={product} />;
}
