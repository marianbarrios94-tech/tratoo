alter table professional_profiles
  drop column stripe_customer_id,
  drop column stripe_subscription_id,
  add column mp_preapproval_id text;

alter table subscription_plans drop column stripe_price_id;
