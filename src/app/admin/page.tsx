export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl text-editorial text-maestro-bone mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-maestro-dark p-6 border border-maestro-bone/10 rounded-sm">
          <h3 className="text-maestro-bone/60 text-xs tracking-widest uppercase mb-2">Total Productos</h3>
          <p className="text-4xl text-maestro-bone font-light">24</p>
        </div>
        <div className="bg-maestro-dark p-6 border border-maestro-bone/10 rounded-sm">
          <h3 className="text-maestro-bone/60 text-xs tracking-widest uppercase mb-2">Categorías Activas</h3>
          <p className="text-4xl text-maestro-bone font-light">5</p>
        </div>
        <div className="bg-maestro-dark p-6 border border-maestro-bone/10 rounded-sm">
          <h3 className="text-maestro-bone/60 text-xs tracking-widest uppercase mb-2">Visitas Hoy</h3>
          <p className="text-4xl text-maestro-gold font-light">1,248</p>
        </div>
      </div>

      <div className="bg-maestro-dark border border-maestro-bone/10 rounded-sm p-6">
        <h2 className="text-lg text-maestro-bone uppercase tracking-widest mb-6 border-b border-maestro-bone/10 pb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <p className="text-sm text-maestro-bone/60">No hay actividad reciente registrada en el sistema.</p>
        </div>
      </div>
    </div>
  );
}
