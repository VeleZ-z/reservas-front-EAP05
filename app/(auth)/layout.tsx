import Link from "next/link";

/**
 * Layout de autenticación (route group `(auth)`).
 * Pantalla dividida: panel de marca a la izquierda y formulario centrado
 * a la derecha. En móvil el panel de marca se colapsa a una cabecera
 * compacta para no empujar el formulario fuera de pantalla.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const props = [
    {
      title: "Agenda sin fricción",
      text: "Publica horarios, recibe reservas y controla la ocupación en tiempo real.",
      icon: (
        <>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      ),
    },
    {
      title: "Catálogo centralizado",
      text: "Servicios, recursos y duraciones definidos una sola vez para todo el equipo.",
      icon: (
        <>
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </>
      ),
    },
    {
      title: "Roles y permisos",
      text: "Cada actor ve exactamente lo que le corresponde: cliente, proveedor o administrador.",
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        </>
      ),
    },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ============ Panel de marca (desktop) ============ */}
      <aside className="relative hidden overflow-hidden bg-brand-gradient p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Textura sutil de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.55) 0, transparent 42%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.35) 0, transparent 46%)",
          }}
        />

        <Link href="/" className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M8 2v4M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-title-md tracking-tight">Reserva.io </span>
            <span className="mt-1 text-caption text-white/70">
              
            </span>
          </span>
        </Link>

        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-white/70">
              Plataforma de reservas
            </p>
            <h1 className="max-w-md text-heading-md text-white lg:text-heading-lg">
              La agenda de tu negocio, ordenada y sin fricción.
            </h1>
            <p className="max-w-md text-body-lg text-white/80">
              Un solo lugar para gestionar servicios, horarios y reservas de
              clientes, proveedores y administradores.
            </p>
          </div>

          <ul className="flex flex-col gap-5">
            {props.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    {p.icon}
                  </svg>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-title-sm text-white">{p.title}</span>
                  <span className="max-w-sm text-body-sm text-white/75">
                    {p.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-caption text-white/60">
          
        </p>
      </aside>

      {/* ============ Formulario ============ */}
      <main className="flex min-h-screen flex-col bg-canvas">
        {/* Cabecera de marca (móvil) */}
        <div className="flex items-center gap-3 border-b border-line bg-surface px-6 py-4 lg:hidden">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[18px]"
            >
              <path d="M8 2v4M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-title-sm text-ink">Reserva.io</span>
            <span className="mt-0.5 text-caption text-ink-subtle">
              
            </span>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[26rem]">{children}</div>
        </div>
      </main>
    </div>
  );
}
