export default function RegisterPage() {
  return (
    <div className="min-vh-100 flex items-center justify-center bg-[var(--color-light-turquoise)] p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-[var(--color-olive-dark)] text-center mb-6">Crear Cuenta</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              className="w-full bg-white border border-[var(--color-olive-dark)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="w-full bg-white border border-[var(--color-olive-dark)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white border border-[var(--color-olive-dark)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)]"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[var(--color-sage-green)] text-white py-2 rounded-md font-medium hover:bg-[var(--color-bronze)] transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}