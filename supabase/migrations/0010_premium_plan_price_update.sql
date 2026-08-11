-- Zolvi — baja de precio del plan Premium a $24.99/mes
-- Mismo patrón que 0009: Price nuevo bajo el mismo Product
-- (price_1U3GldLXOOTSVut3pmOTFPfJ), el anterior
-- (price_1TyC4aLXOOTSVut3KFtkGbSb) queda desactivado — las suscripciones
-- Premium ya activas siguen cobrando $34.99 hasta que el profesional
-- cambie de plan.

update subscription_plans
set price_monthly = 24.99, stripe_price_id = 'price_1U3GldLXOOTSVut3pmOTFPfJ'
where slug = 'premium';
