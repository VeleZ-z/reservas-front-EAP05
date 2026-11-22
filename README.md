# Reserva.io — Frontend del Sistema de Reservas

Frontend en **Next.js 14 (App Router) + TypeScript + Tailwind CSS** para la API de reservas de servicios (Spring Boot desplegada en Render).

## Estado

- ✅ Build limpio: `npm run build` → **21 rutas** (3 dinámicas).
- ✅ TypeScript en modo estricto sin errores (`npx tsc --noEmit`).
- ✅ QA visual con Chrome headless en escritorio (1440 px) y móvil (390 px), con datos simulados por rol.
- ✅ Login real verificado contra el backend desplegado.
- ⏳ Pendiente: desplegar en Vercel y añadir el dominio del frontend a `APP_CORS_ALLOWED_ORIGINS` del backend.

## Requisitos

- Node.js 18.17+ (probado con Node 24).
- Backend accesible (por defecto `https://fabrica-2026-2-eap05-1.onrender.com`).

## Configuración

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=https://fabrica-2026-2-eap05-1.onrender.com
```

`NEXT_PUBLIC_API_URL` se configura en Vercel como **Environment Variable pública** (no como Secret): Next.js la inyecta en el bundle porque el navegador llama directamente a la API.

> **CORS:** el backend solo autoriza los orígenes de `APP_CORS_ALLOWED_ORIGINS`. Para que el frontend funcione en Vercel hay que añadir el dominio del despliegue (por ejemplo `https://reservas-front-eap05.vercel.app`) a esa variable en Render.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint (`next lint`) |

## Rutas

### Públicas (`(auth)`)

- `/login`, `/registro`, `/recuperar-contrasena`

### Aplicación (`(app)`)

| Ruta | Rol | Descripción |
| --- | --- | --- |
| `/` | Todos | Panel con accesos según el rol |
| `/agenda` | Proveedor | Reservas recibidas |
| `/horarios` | Proveedor | Registrar y bloquear horarios |
| `/historial-proveedor` | Proveedor | Reservas de sus servicios, con datos del cliente |
| `/servicios` | Administrador | Alta de servicios, recursos y asignación de proveedores |
| `/eventos` | Administrador | Ocupación de eventos por periodo + acciones |
| `/eventos/registrar` | Administrador | Crear evento |
| `/eventos/[id]/actualizar` | Administrador | Editar nombre, descripción y fechas |
| `/eventos/[id]/capacidad` | Administrador | Cambiar capacidad máxima |
| `/servicios/uso` | Administrador | Reservas por servicio en un periodo |
| `/servicios/ocupacion` | Administrador | % de horarios reservados por servicio |
| `/historial-negocio` | Administrador | Reservas de servicios y eventos en una vista |
| `/reservas` | Cliente | Crear y cancelar reservas |
| `/servicios/disponibilidad` | Cliente | Horarios libres de un servicio y reserva en un clic |
| `/eventos/reservar` | Cliente | Reservar cupo de un evento o cancelar una reserva |
| `/historial` | Cliente | Historial real de reservas (`GET /api/reservas/historial`) |

Cada página valida la sesión y el rol con `RequiereSesion` / `RolNoPermitido`; la navegación lateral y la topbar móvil filtran las entradas por rol.

## Estructura

```
app/
  (auth)/                 # login, registro, recuperación
  (app)/                  # panel, agenda, horarios, servicios, eventos, historial…
  globals.css             # tokens de diseño (3 tiers)
  layout.tsx              # layout raíz
components/
  ui/                     # Card, Button, Input, Select, Badge, Alert, Feedback
  app-shell.tsx           # sidebar + topbar + navegación por rol
  acceso-restringido.tsx  # RequiereSesion / RolNoPermitido
  page-header.tsx
src/
  api/                    # clientes tipados contra el contrato real
    auth.ts  agenda.ts  horarios.ts  eventos.ts  recursos.ts
    proveedor-servicio.ts  reservas.ts  servicios.ts  sesion.ts  config.ts
  lib/
    fechas.ts             # conversión datetime-local ↔ ISO-8601
    reservas-cliente.ts   # utilidades locales (UUID, reservas en curso)
```

## Clientes de API

Todos usan `apiFetch` (`src/api/config.ts`), que:

- antepone `NEXT_PUBLIC_API_URL`;
- envía `Authorization: Bearer <token>` cuando hay sesión;
- aplica un timeout de **120 s** (cold start de Render);
- traduce errores del backend (`mensaje`, `error`, `message`, `detail`);
- cierra la sesión automáticamente ante un **401**.

Endpoints cubiertos: agenda, autenticación (login/logout/registro/recuperación), horarios, recursos, proveedor-servicio, reservas (crear, cancelar, historial de cliente/proveedor/negocio, ocupación de servicios), servicios (registro, modificación, uso, disponibilidad) y eventos (registro, actualización, capacidad, ocupación, reservar y cancelar cupo).

## Diseño

- **Paleta obligatoria:** `#DDF3F0`, `#60714E`, `#89A666`, `#838E73`, `#72583D`.
- **Tokens en 3 capas:** global → alias semántico (`bg-primary`, `text-ink-muted`, `border-line`…) → componente, definidos en `app/globals.css` y `tailwind.config.ts`.
- Componentes con estados de foco visibles, contraste AA y navegación por teclado.
- Tablas con desplazamiento horizontal y columnas secundarias ocultas en móvil.
- Reportes con rango por defecto (últimos 30/60 días) y auto-carga al entrar.
