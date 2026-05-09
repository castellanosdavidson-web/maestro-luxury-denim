import { motion } from "framer-motion";
import Link from "next/link";

export default function Categories({ categories }: { categories?: any[] }) {
  const safeCategories = categories || [];

  return (
    <section className="py-24 bg-maestro-dark">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl text-editorial text-maestro-bone mb-4">
            Colecciones
          </h2>
          <div className="w-12 h-[1px] bg-maestro-gold mb-4" />
          <p className="text-maestro-bone/60 tracking-[0.2em] uppercase text-sm">
            La esencia del denim
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {safeCategories.filter(c => c.colSpan).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className={`group relative overflow-hidden block ${category.colSpan} ${category.rowSpan}`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              
              {/* Overlay cohesivo para dar mismo tratamiento de color */}
              <div className="absolute inset-0 bg-maestro-dark/50 mix-blend-multiply transition-opacity duration-700 group-hover:bg-maestro-dark/20" />
              <div className="absolute inset-0 backdrop-grayscale-[30%] group-hover:backdrop-grayscale-0 transition-all duration-700" />
              
              {/* Gradient Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-maestro-dark via-maestro-dark/30 to-transparent opacity-90" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                <div>
                  <h3 className="text-3xl text-editorial text-maestro-bone mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {category.name}
                  </h3>
                  <p className="text-maestro-gold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Explorar
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
