-- Zolvi — baja de precio del plan Pro a $9.99/mes
-- Stripe Price es inmutable en su monto: se creó un Price nuevo
-- (price_1U3GLxLXOOTSVut31lBEvEm5) bajo el mismo Product que el anterior
-- (price_1TyC4YLXOOTSVut3w051M1pn, desactivado — las suscripciones ya
-- activas con el precio viejo siguen cobrando $19.99 hasta que el
-- profesional cambie de plan).

update subscription_plans
set price_monthly = 9.99, stripe_price_id = 'price_1U3GLxLXOOTSVut31lBEvEm5'
where slug = 'pro';
