-- El plan Pro prometía "Insignia de verificado" y "Estadísticas básicas", pero
-- ambas las tiene cualquier perfil (gratis o Pro). La lista pasa a describir lo
-- que de verdad diferencia al Pro.
update public.subscription_plans
set features = '["Solicitudes ilimitadas", "Prioridad en el directorio", "Distintivo Pro en tu perfil"]'::jsonb
where slug = 'pro';
