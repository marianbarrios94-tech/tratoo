-- Zolvi — planes pagos en pesos argentinos
-- Mismo patrón que 0009/0010: Price nuevo bajo el mismo Product (en ARS esta
-- vez), el anterior en USD queda desactivado — las suscripciones ya activas
-- en dólares siguen cobrando en dólares hasta que el profesional cambie de
-- plan.
--
-- Pro:     price_1U3GLxLXOOTSVut31lBEvEm5 (USD 9.99)  -> price_1U4QgbLXOOTSVut3r6yqjGpJ (ARS 15.000)
-- Premium: price_1U3GldLXOOTSVut3pmOTFPfJ (USD 24.99) -> price_1U4QgcLXOOTSVut3xKMvLfy5 (ARS 35.000)
--
-- Básico ya no se ofrece a nuevos suscriptores (ver 0009) y se queda en USD
-- para sus 2 suscriptores existentes — de ahí la columna currency explícita,
-- para no formatear ese precio como si fueran pesos.

alter table subscription_plans add column if not exists currency text not null default 'ars';

update subscription_plans set currency = 'usd' where slug = 'basico';

update subscription_plans
set price_monthly = 15000, stripe_price_id = 'price_1U4QgbLXOOTSVut3r6yqjGpJ', currency = 'ars'
where slug = 'pro';

update subscription_plans
set price_monthly = 35000, stripe_price_id = 'price_1U4QgcLXOOTSVut3xKMvLfy5', currency = 'ars'
where slug = 'premium';
