# Plataforma de Reservas de Servicios — Frontend (UI)

Interfaz web para la Plataforma de Reservas de Servicios, Espacios e Insumos (Caso 14). Desarrollada en el marco de la Fábrica Escuela CodeF@ctory UdeA (Semestre 2026-2, Equipo EAP05).

---

## Tecnologías

- Framework: Next.js (App Router)
- Lenguaje: TypeScript
- Estilos: Tailwind CSS
- Calidad de código: ESLint
- Despliegue: Vercel

---

## Estructura del Proyecto

```text
reservas-front-EAP05/
├── app/                  # Rutas y páginas de la aplicación
├── components/           # Componentes UI reutilizables
├── lib/                  # Utilidades globales
├── public/               # Archivos estáticos
├── src/api/              # Integración REST con el Backend Spring Boot
├── eslint.config.mjs     # Configuración de linter
├── next-config.js        # Configuración de Next.js
├── package.json          # Dependencias y scripts
├── tailwind.config.ts    # Configuración de Tailwind CSS
├── tsconfig.json         # Configuración de TypeScript
└── vercel.json           # Configuración de despliegue en Vercel
```

---

## Funcionalidades Principales

1. Autenticación y Registro: Control de acceso por roles (Cliente, Proveedor, Administrador).
2. Servicios y Recursos: Creación y parametrización de servicios asociados a recursos e insumos.
3. Disponibilidad: Gestión de franjas horarias y bloqueos administrativos.
4. Reservas: Consulta e interacción en tiempo real con validación de disponibilidad y regla de cancelación con 12 horas de antelación.
5. Reportes: Historiales de uso y métricas de ocupación.

---

## Configuración Local

### Prerrequisitos
- Node.js 18+
- npm, yarn, pnpm o bun

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/VeleZ-z/reservas-front-EAP05
   cd reservas-front-EAP05
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Variables de entorno (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## Scripts

- `npm run dev`: Servidor de desarrollo.
- `npm run build`: Compilación para producción.
- `npm run start`: Inicia el servidor compilado.
- `npm run lint`: Análisis estático con ESLint.

---

## Repositorio Relacionado

- Backend REST API (Spring Boot): [Camila-cabarcas/Fabrica-2026-2-EAP05](https://github.com/Camila-cabarcas/Fabrica-2026-2-EAP05)

---

## Equipo de Desarrollo (EAP05)

- Karen Cardona Gutiérrez
- Lizbeth Marcela Espinosa Mendoza
- Juan José Garzón Mejía
- Guillermo Mejía Uribe
- Juan Ignacio Parra Hoyos
- Juan Camilo Vélez Chaverra
