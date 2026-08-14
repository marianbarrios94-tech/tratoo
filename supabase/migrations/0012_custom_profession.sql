-- Zolvi — profesión de texto libre para categorías no listadas
-- category_id pasa a ser opcional: si un profesional no encuentra su
-- categoría en la lista (hay miles de profesiones posibles, no vamos a
-- tenerlas todas de antemano), puede escribir la suya en custom_profession.
-- Se muestra tal cual en el directorio y el perfil público, sin moderación
-- previa (mismo criterio que business_name/bio, que ya son texto libre).
-- No es filtrable por rubro/categoría porque no tiene una asignada — si con
-- el tiempo se repite una profesión, se puede promover a categoría real con
-- un insert manual en `categories`.

alter table professional_profiles add column custom_profession text;
