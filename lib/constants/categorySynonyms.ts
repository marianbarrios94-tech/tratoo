// Términos alternativos por categoría para que el buscador de texto libre
// encuentre resultados aunque no se escriba el nombre exacto de la
// categoría — la gente busca "Abogado", no "Abogacía". Ver
// app/profesionales/page.tsx, donde se cruzan contra la búsqueda junto al
// nombre de la categoría.
export const CATEGORY_SYNONYMS: Record<string, string[]> = {
  plomeria: ['plomero', 'plomera'],
  electricidad: ['electricista'],
  gas: ['gasista'],
  limpieza: ['limpiador', 'limpiadora', 'mucama'],
  cerrajeria: ['cerrajero', 'cerrajera'],
  mudanzas: ['flete', 'fletero', 'mudancero'],
  refrigeracion: ['aire acondicionado', 'frigorista', 'heladeras'],
  herreria: ['herrero', 'herrera'],
  'reparacion-electrodomesticos': ['tecnico', 'tecnica', 'electrodomesticos'],
  arquitectura: ['arquitecto', 'arquitecta'],
  traduccion: ['traductor', 'traductora'],
  'desarrollo-software': ['programador', 'programadora', 'desarrollador', 'desarrolladora'],
  fotografia: ['fotografo', 'fotografa'],
  abogacia: ['abogado', 'abogada'],
  contabilidad: ['contador', 'contadora'],
  diseno: ['disenador', 'disenadora'],
  marketing: ['publicidad', 'community manager'],
  'recursos-humanos': ['rrhh'],
  psicologia: ['psicologo', 'psicologa'],
  'entrenamiento-personal': ['entrenador', 'entrenadora', 'personal trainer'],
  'medicina-general': ['medico', 'medica', 'doctor', 'doctora'],
  kinesiologia: ['kinesiologo', 'kinesiologa', 'kinesio'],
  odontologia: ['odontologo', 'odontologa', 'dentista'],
  fonoaudiologia: ['fonoaudiologo', 'fonoaudiologa'],
  masoterapia: ['masajista', 'masoterapeuta'],
  'yoga-pilates': ['profesor de yoga', 'instructor de yoga', 'profesor de pilates'],
  nutricion: ['nutricionista'],
}
