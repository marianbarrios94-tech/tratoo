# Zolvi

Marketplace de servicios profesionales: conecta clientes con profesionales de
hogar, consultoría y salud. Los profesionales se monetizan por suscripción.

Construido con Next.js 16 (App Router), React 19, Tailwind v4 y Supabase
(auth + Postgres).

## Setup

### 1. Crear el proyecto de Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta / iniciá sesión.
2. Creá un proyecto nuevo (elegí una región cercana y una contraseña de base de datos).
3. Andá a **Settings → API** y copiá el **Project URL** y la **anon public key**.

### 2. Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá los valores:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=<tu Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu anon public key>
```

### 3. Correr la migración de base de datos

Si el proyecto de Supabase es nuevo y vacío, andá directo al paso siguiente.
Si es un proyecto reciclado que ya tenía tablas de un intento anterior,
corré primero [`supabase/migrations/0000_reset_legacy_fixnow.sql`](supabase/migrations/0000_reset_legacy_fixnow.sql)
en el SQL Editor para limpiarlas.

Después, corré en orden los archivos de `supabase/migrations/` que falten en tu
proyecto (`0001_init.sql`, y a medida que se agreguen, los siguientes como
`0002_profiles_visible_to_related_professional.sql`). Cada uno se pega entero en
el SQL Editor y se ejecuta una sola vez.

### 4. Instalar dependencias y correr

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Estructura relevante

- `app/page.tsx` — landing pública con las tres verticales y los planes.
- `app/(auth)/` — login, registro (con selector de rol) y server actions de auth.
- `app/auth/callback/route.ts` — confirmación de email de Supabase.
- `app/panel/` — dashboard de profesionales (protegido por `middleware.ts`).
- `app/cuenta/` — dashboard de clientes (protegido por `middleware.ts`).
- `lib/supabase/` — clientes de Supabase para browser, server components y middleware.
- `lib/types/database.ts` — tipos manuales de la base (reemplazar con
  `npx supabase gen types typescript` cuando el esquema esté estable).
- `supabase/migrations/` — SQL versionado del esquema.

## Roadmap

- **Fase 2** — directorio público de profesionales + búsqueda por categoría/ciudad.
- **Fase 3** — flujo de solicitud/reserva entre cliente y profesional.
- **Fase 4** — suscripciones reales con Stripe (checkout, webhook, portal).
- **Fase 5** — reseñas y pulido general.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run lint    # eslint
```
