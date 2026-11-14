export default function HomePage() {
  return (
    <div className="pt-24">
      <h1 className="text-4xl font-bold text-olive-dark mb-6">
        Panel de Control
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-olive-dark mb-2">Usuarios Registrados</h3>
          <p className="text-lg text-olive-dark">--</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-olive-dark mb-2">Servicios Disponibles</h3>
          <p className="text-lg text-olive-dark">--</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-olive-dark mb-2">Reservas Activas</h3>
          <p className="text-lg text-olive-dark">--</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-medium text-olive-dark mb-2">Recursos</h3>
          <p className="text-lg text-olive-dark">--</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          className="bg-sage-green text-white px-4 py-2 rounded-md hover:bg-bronze"
        >
          Gestionar Servicios
        </button>

        <button 
          className="bg-olive-dark text-white px-4 py-2 rounded-md hover:bg-5a6d53"
        >
          Gestionar Recursos
        </button>

        <button 
          className="bg-transparent text-olive-dark px-4 py-2 rounded-md hover:bg-lightTurquoise"
        >
          Ver Reservas
        </button>

        <button 
          className="bg-transparent text-olive-dark px-4 py-2 rounded-md hover:bg-lightTurquoise"
        >
          Ver Agenda
        </button>
      </div>
    </div>
  );
}