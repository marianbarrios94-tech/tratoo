-- Zolvi — Fase 4
-- Completa stripe_price_id con los Price de Stripe (modo test) creados vía API
-- para los 3 planes seed de subscription_plans.

update subscription_plans set stripe_price_id = 'price_1TyC56LXOOTSVut328l5hbe5' where slug = 'basico';
update subscription_plans set stripe_price_id = 'price_1TyC4YLXOOTSVut3w051M1pn' where slug = 'pro';
update subscription_plans set stripe_price_id = 'price_1TyC4aLXOOTSVut3KFtkGbSb' where slug = 'premium';
