import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export type DbSchema = {
  settings: {
    heroTitle: string;
    heroSubtitle: string;
    heroCaption: string;
    heroValueProp: string;
    heroImage?: string;
  };
  products: any[];
  categories: any[];
};

const defaultData: DbSchema = {
  settings: {
    heroTitle: "DISEÑADO\nPARA MUJERES",
    heroSubtitle: "que imponen estilo.",
    heroCaption: "Denim premium · Edición limitada",
    heroValueProp: "Confección colombiana con estándares globales",
    heroImage: "/uploads/hero-custom.jpg"
  },
  products: [],
  categories: [
    { id: "chaquetas", name: "Chaquetas", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1 md:row-span-2", status: "Activa" },
    { id: "blusas-y-corset", name: "Blusas y Corset", image: "https://images.unsplash.com/photo-1621815155702-8ebfce7e012e?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1", rowSpan: "row-span-1", status: "Activa" },
    { id: "pantalones", name: "Pantalones", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1", rowSpan: "row-span-1", status: "Activa" },
    { id: "vestidos", name: "Vestidos", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1", rowSpan: "row-span-1", status: "Activa" },
    { id: "faldas", name: "Faldas", image: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1", status: "Activa" },
    { id: "gabardinas", name: "Gabardinas", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1", rowSpan: "row-span-1", status: "Activa" },
    { id: "chalecos", name: "Chalecos", image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1", rowSpan: "row-span-1", status: "Activa" },
    { id: "enterizo", name: "Enterizo", image: "https://images.unsplash.com/photo-1601614947936-a83a055d78be?q=80&w=800&auto=format&fit=crop", colSpan: "col-span-1", rowSpan: "row-span-1", status: "Activa" }
  ]
};

export async function readDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(data) as DbSchema;
    if (!db.categories) {
      db.categories = defaultData.categories;
      await writeDb(db);
    }
    return db;
  } catch (error) {
    await writeDb(defaultData);
    return defaultData;
  }
}

export async function writeDb(data: DbSchema): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}
