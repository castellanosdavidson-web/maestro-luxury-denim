import Link from "next/link";
import { LayoutDashboard, Package, Tag, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/products", icon: Package },
    { name: "Categorías", href: "/admin/categories", icon: Tag },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-maestro-carbon flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-maestro-dark border-r border-maestro-bone/10 flex flex-col">
        <div className="p-6 border-b border-maestro-bone/10">
          <Link href="/" className="text-2xl text-editorial tracking-widest text-maestro-bone">
            MAESTRO <span className="text-xs tracking-widest text-maestro-gold block mt-1 font-sans">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm tracking-widest uppercase text-maestro-bone/60 hover:text-maestro-bone hover:bg-maestro-bone/5 rounded-sm transition-colors"
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-maestro-bone/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm tracking-widest uppercase text-maestro-bone/60 hover:text-maestro-gold transition-colors">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
