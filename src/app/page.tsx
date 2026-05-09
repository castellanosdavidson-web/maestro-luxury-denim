import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import { readDb } from "@/lib/localDb";

export default async function Home() {
  const db = await readDb();

  return (
    <main className="min-h-screen bg-maestro-dark">
      <Navbar />
      <Hero settings={db.settings} />
      <Categories categories={db.categories} />
    </main>
  );
}
