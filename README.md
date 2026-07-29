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
SUPABASE_SERVICE_ROLE_KEY=<Settings → API → service_role secret>
STRIPE_SECRET_KEY=<Developers → API keys → Secret key, sk_test_...>
STRIPE_WEBHOOK_SECRET=<ver sección de Stripe más abajo>
```

`SUPABASE_SERVICE_ROLE_KEY` bypasea RLS — la usa únicamente el webhook de
Stripe (`app/api/webhooks/stripe/route.ts`), nunca código que corre en el
browser.

### Stripe

1. Creá cuenta en [stripe.com](https://stripe.com) (modo test).
2. Creá un producto + precio recurrente mensual en Stripe por cada fila de
   `subscription_plans` y completá su `stripe_price_id` (ver
   [`supabase/migrations/0003_stripe_price_ids.sql`](supabase/migrations/0003_stripe_price_ids.sql)
   como referencia del formato).
3. Para desarrollo local, instalá la [Stripe CLI](https://github.com/stripe/stripe-cli/releases/latest),
   corré `stripe login` y dejá corriendo
   `stripe listen --forward-to localhost:3000/api/webhooks/stripe` — te va a
   imprimir el `whsec_...` para `STRIPE_WEBHOOK_SECRET` local.
4. Para producción, creá un webhook endpoint en el Dashboard de Stripe (o vía
   API) apuntando a `https://<tu-dominio>/api/webhooks/stripe`, con los
   eventos `checkout.session.completed`, `customer.subscription.updated` y
   `customer.subscription.deleted`. Ese endpoint tiene su **propio**
   `whsec_...`, distinto al de la CLI — va en `STRIPE_WEBHOOK_SECRET` del
   entorno de producción (Vercel), no en `.env.local`.

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

## Deploy (Vercel)

1. Importá el repo en [vercel.com](https://vercel.com) (Add New → Project).
2. Cargá las 5 variables de entorno de arriba en Settings → Environment
   Variables antes (o después, con un redeploy) del primer deploy.
3. Una vez que tengas la URL de producción, creá el webhook endpoint de
   Stripe de producción (ver sección de Stripe arriba) apuntando a esa URL,
   y cargá su `whsec_...` en `STRIPE_WEBHOOK_SECRET` — después hay que
   redesplegar para que tome el valor nuevo.

Sitio en producción: https://zolvi-iota.vercel.app

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) corre `npm run lint` y
`npm run build` en cada push. El build no depende de que existan las
variables de entorno (los clientes de Supabase y Stripe se instancian de
forma diferida, no al importar el módulo), así que pasa igual sin secretos
configurados en el repo.

## Estructura relevante

- `app/page.tsx` — landing pública con las tres verticales y los planes.
- `app/(auth)/` — login, registro (con selector de rol) y server actions de auth.
- `app/auth/callback/route.ts` — confirmación de email de Supabase.
- `app/panel/` — dashboard de profesionales (protegido por `proxy.ts`).
- `app/cuenta/` — dashboard de clientes (protegido por `proxy.ts`).
- `app/profesionales/` — directorio público, detalle y flujo de solicitud.
- `app/solicitudes/actions.ts` — transiciones de estado de `service_requests`
  compartidas entre `/panel/solicitudes` y `/cuenta/solicitudes`.
- `app/api/webhooks/stripe/route.ts` — sincroniza suscripciones desde Stripe.
- `lib/supabase/` — clientes de Supabase para browser, server components,
  proxy (`proxy.ts`, refresca la sesión) y admin (service role, solo webhook).
- `lib/stripe/server.ts` — `createStripeClient()`, instanciado bajo demanda.
- `lib/types/database.ts` — tipos manuales de la base (reemplazar con
  `npx supabase gen types typescript` cuando el esquema esté estable).
- `supabase/migrations/` — SQL versionado del esquema, en orden.

## Roadmap

- ✅ **Fase 1** — auth con roles, esquema, landing.
- ✅ **Fase 2** — directorio público de profesionales + búsqueda por categoría/ciudad.
- ✅ **Fase 3** — flujo de solicitud/reserva entre cliente y profesional.
- ✅ **Fase 4** — suscripciones reales con Stripe (checkout, webhook, portal).
- ✅ **Fase 5** — reseñas y pulido general.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run lint    # eslint
```
