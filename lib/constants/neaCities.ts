import type { PROVINCES } from '@/lib/constants/provinces'

export type NeaCity = {
  name: string
  key: string
  province: (typeof PROVINCES)[number]
  lat: number
  lng: number
}

export const NEA_CITIES: NeaCity[] = [
  { name: 'Posadas', key: 'posadas', province: 'Misiones', lat: -27.3671, lng: -55.8961 },
  { name: 'Oberá', key: 'obera', province: 'Misiones', lat: -27.487, lng: -55.1199 },
  { name: 'Eldorado', key: 'eldorado', province: 'Misiones', lat: -26.4008, lng: -54.642 },
  { name: 'Puerto Iguazú', key: 'puerto iguazu', province: 'Misiones', lat: -25.5952, lng: -54.5734 },
  { name: 'Apóstoles', key: 'apostoles', province: 'Misiones', lat: -27.9167, lng: -55.75 },
  { name: 'Jardín América', key: 'jardin america', province: 'Misiones', lat: -27.0333, lng: -55.2 },
  { name: 'Leandro N. Alem', key: 'leandro n alem', province: 'Misiones', lat: -27.6, lng: -55.3167 },
  { name: 'Montecarlo', key: 'montecarlo', province: 'Misiones', lat: -26.5667, lng: -54.7667 },
  { name: 'San Ignacio', key: 'san ignacio', province: 'Misiones', lat: -27.25, lng: -55.5333 },
  { name: 'Puerto Rico', key: 'puerto rico', province: 'Misiones', lat: -26.7833, lng: -54.9 },

  { name: 'Corrientes', key: 'corrientes', province: 'Corrientes', lat: -27.4692, lng: -58.8306 },
  { name: 'Goya', key: 'goya', province: 'Corrientes', lat: -29.1401, lng: -59.266 },
  { name: 'Mercedes', key: 'mercedes', province: 'Corrientes', lat: -29.1833, lng: -58.0833 },
  { name: 'Paso de los Libres', key: 'paso de los libres', province: 'Corrientes', lat: -29.7, lng: -57.0833 },
  { name: 'Curuzú Cuatiá', key: 'curuzu cuatia', province: 'Corrientes', lat: -29.7833, lng: -58.05 },
  { name: 'Santo Tomé', key: 'santo tome', province: 'Corrientes', lat: -28.5528, lng: -56.0472 },
  { name: 'Bella Vista', key: 'bella vista', province: 'Corrientes', lat: -28.5, lng: -59.0333 },
  { name: 'Ituzaingó', key: 'ituzaingo', province: 'Corrientes', lat: -27.5833, lng: -56.6833 },
  { name: 'Monte Caseros', key: 'monte caseros', province: 'Corrientes', lat: -30.2667, lng: -57.6333 },
  { name: 'Esquina', key: 'esquina', province: 'Corrientes', lat: -30.0, lng: -59.5333 },

  { name: 'Resistencia', key: 'resistencia', province: 'Chaco', lat: -27.4512, lng: -58.9867 },
  { name: 'Barranqueras', key: 'barranqueras', province: 'Chaco', lat: -27.4833, lng: -58.9333 },
  { name: 'Fontana', key: 'fontana', province: 'Chaco', lat: -27.4667, lng: -58.9667 },
  { name: 'Presidencia Roque Sáenz Peña', key: 'saenz pena', province: 'Chaco', lat: -26.7852, lng: -60.4388 },
  { name: 'Villa Ángela', key: 'villa angela', province: 'Chaco', lat: -27.5833, lng: -60.7167 },
  { name: 'Charata', key: 'charata', province: 'Chaco', lat: -27.2167, lng: -61.2 },
  { name: 'Las Breñas', key: 'las brenas', province: 'Chaco', lat: -27.0833, lng: -61.05 },
  { name: 'Quitilipi', key: 'quitilipi', province: 'Chaco', lat: -27.0167, lng: -60.2167 },
  { name: 'Machagai', key: 'machagai', province: 'Chaco', lat: -26.9333, lng: -60.05 },

  { name: 'Formosa', key: 'formosa', province: 'Formosa', lat: -26.1775, lng: -58.1781 },
  { name: 'Clorinda', key: 'clorinda', province: 'Formosa', lat: -25.2861, lng: -57.7139 },
  { name: 'Pirané', key: 'pirane', province: 'Formosa', lat: -25.7333, lng: -59.1167 },
  { name: 'El Colorado', key: 'el colorado', province: 'Formosa', lat: -26.3, lng: -59.35 },
  { name: 'Las Lomitas', key: 'las lomitas', province: 'Formosa', lat: -24.7, lng: -60.5833 },
  { name: 'Ingeniero Juárez', key: 'ingeniero juarez', province: 'Formosa', lat: -23.9, lng: -61.85 },
]
