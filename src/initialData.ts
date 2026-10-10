import { ProductServiceItem, ProviderProfile, Appointment, UserRequest, ServiceCategory } from './types';

export const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov_marta',
    name: 'Marta Tunubalá',
    specialty: 'Artesanías Misak',
    rating: 4.9,
    reviewsCount: 112,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
    bio: 'Tejedora tradicional del municipio de Silvia, Cauca. Elaboro mochilas, ruanas y tambores manteniendo vivas las tradiciones de mi comunidad.',
    location: 'Silvia, Cauca (Envíos a Popayán)',
    skills: ['Tejido en lana', 'Mochilas', 'Diseños Tradicionales'],
    isOnline: true,
    earningsToday: 120000
  },
  {
    id: 'prov_carlos',
    name: 'Carlos Muñoz',
    specialty: 'Jabones y Útiles Ecológicos',
    rating: 4.8,
    reviewsCount: 96,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    bio: 'Emprendedor de Popayán dedicado a la creación de productos de aseo biodegradables y jabones artesanales con esencias locales.',
    location: 'Barrio La Esmeralda, Popayán',
    skills: ['Jabones Artesanales', 'Detergentes Bio', 'Aseo Sostenible'],
    isOnline: true,
    earningsToday: 85000
  },
  {
    id: 'prov_lucia',
    name: 'Lucía Gómez',
    specialty: 'Agricultura Orgánica Local',
    rating: 5.0,
    reviewsCount: 184,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=800&auto=format&fit=crop',
    bio: 'Productora campesina de la zona de Puracé. Cultivo frutas de clima frío y extraigo miel pura de abejas sin pesticidas.',
    location: 'Vereda Santa Leticia, Puracé',
    skills: ['Cultivo Orgánico', 'Apicultura', 'Cosecha Responsable'],
    isOnline: true,
    earningsToday: 215000
  },
  {
    id: 'prov_julio',
    name: 'Julio Paz',
    specialty: 'Plomería y Mantenimiento',
    rating: 4.7,
    reviewsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    bio: 'Especialista en reparaciones domésticas. Arreglo tuberías, instalaciones eléctricas básicas y goteras. Atención en el casco urbano de Popayán.',
    location: 'Centro Histórico, Popayán',
    skills: ['Plomería', 'Electricidad Básica', 'Impermeabilización'],
    isOnline: true,
    earningsToday: 95000
  },
  {
    id: 'prov_teresa',
    name: 'Teresa Solano',
    specialty: 'Gastronomía Tradicional',
    rating: 4.9,
    reviewsCount: 305,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1528738064262-9f834a7d2bf6?q=80&w=800&auto=format&fit=crop',
    bio: 'Rescatando los sabores de Popayán. Preparo auténticos tamales y empanadas de pipián con la receta de la abuela, con maní y ají tradicional.',
    location: 'Barrio Bolívar, Popayán',
    skills: ['Comida Típica', 'Pipián', 'Amasijos'],
    isOnline: false,
    earningsToday: 350000
  }
];

export const INITIAL_ITEMS: ProductServiceItem[] = [
  // Productos Aseo
  {
    id: 'item_jabon_calendula',
    name: 'Jabón Artesanal de Caléndula y Café',
    category: 'productos_aseo',
    price: 15000,
    priceUnit: 'unidad',
    description: 'Jabón exfoliante elaborado a mano con granos de café del Cauca y extracto de caléndula, ideal para el cuidado de la piel.',
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800&auto=format&fit=crop',
    stock: 35,
    isService: false,
    providerId: 'prov_carlos',
    acceptsBarter: true,
    barterPreferences: 'Hortalizas, frutas frescas o miel',
    estimatedBarterValue: 15
  },
  {
    id: 'item_kit_aseo',
    name: 'Kit de Limpieza Ecológica',
    category: 'productos_aseo',
    price: 45000,
    priceUnit: 'unidad',
    description: 'Kit que incluye detergente biodegradable, limpiador multiusos de cítricos y esponja natural de luffa.',
    image: 'https://images.unsplash.com/photo-1584820927498-cafe2c1c6849?q=80&w=800&auto=format&fit=crop',
    stock: 12,
    isService: false,
    providerId: 'prov_carlos'
  },
  {
    id: 'item_jabon_lavanda',
    name: 'Set de Jabones de Lavanda y Romero',
    category: 'productos_aseo',
    price: 25000,
    priceUnit: 'set',
    description: 'Trío de jabones artesanales enriquecidos con aceites esenciales relajantes, amigables con tu piel y el medio ambiente.',
    image: 'https://images.unsplash.com/photo-1611078488825-9a4f4d2de45c?q=80&w=800&auto=format&fit=crop',
    stock: 25,
    isService: false,
    providerId: 'prov_carlos',
    acceptsBarter: true,
    barterPreferences: 'Plantas aromáticas o envases de vidrio',
    estimatedBarterValue: 25
  },
  {
    id: 'item_cepillos_bambu',
    name: 'Kit de Cepillos Limpiadores de Bambú',
    category: 'productos_aseo',
    price: 32000,
    priceUnit: 'kit',
    description: 'Alternativa sostenible para la limpieza del hogar. Incluye cepillos de cerdas naturales y mangos de bambú.',
    image: 'https://images.unsplash.com/photo-1605600659901-766b9623e5cc?q=80&w=800&auto=format&fit=crop',
    stock: 18,
    isService: false,
    providerId: 'prov_carlos'
  },
  // Artesanias
  {
    id: 'item_mochila_misak',
    name: 'Mochila Tradicional Misak',
    category: 'artesanias',
    price: 120000,
    priceUnit: 'unidad',
    description: 'Mochila en lana de oveja hilada a mano, colores magenta, azul y negro propios de la cultura Misak de Silvia, Cauca.',
    image: 'https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?q=80&w=800&auto=format&fit=crop',
    stock: 5,
    isService: false,
    providerId: 'prov_marta',
    acceptsBarter: true,
    barterPreferences: 'Servicios de publicidad, insumos agrícolas o transporte',
    estimatedBarterValue: 120
  },
  {
    id: 'item_ceramica_pintada',
    name: 'Juego de Cerámica Pintada a Mano',
    category: 'artesanias',
    price: 85000,
    priceUnit: 'juego',
    description: 'Hermoso juego de 3 vasijas de cerámica, moldeadas y pintadas a mano con diseños ancestrales por artesanas locales.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0cb3d1619b?q=80&w=800&auto=format&fit=crop',
    stock: 8,
    isService: false,
    providerId: 'prov_marta',
    acceptsBarter: true,
    barterPreferences: 'Materias primas (arcilla, pinturas) o alimentos',
    estimatedBarterValue: 85
  },
  {
    id: 'item_canasto_mimbre',
    name: 'Canasto Tradicional Tejido',
    category: 'artesanias',
    price: 35000,
    priceUnit: 'unidad',
    description: 'Canasto resistente tejido en mimbre y fibras naturales, ideal para decoración o compras ecológicas.',
    image: 'https://images.unsplash.com/photo-1591081636173-3f1fbac03dcc?q=80&w=800&auto=format&fit=crop',
    stock: 12,
    isService: false,
    providerId: 'prov_marta'
  },
  // Agro Local
  {
    id: 'item_miel_purace',
    name: 'Miel de Abejas Pura del Puracé',
    category: 'agro_local',
    price: 28000,
    priceUnit: 'unidad',
    description: 'Miel cruda de bosque alto andino, recolectada por asociaciones campesinas en las faldas del Volcán Puracé.',
    image: 'https://images.unsplash.com/photo-1587049352847-4d4b1275eb1f?q=80&w=800&auto=format&fit=crop',
    stock: 20,
    isService: false,
    providerId: 'prov_lucia',
    acceptsBarter: true,
    barterPreferences: 'Utensilios de cocina o jabones artesanales',
    estimatedBarterValue: 28
  },
  {
    id: 'item_fresas',
    name: 'Canasta de Fresas Orgánicas',
    category: 'agro_local',
    price: 12000,
    priceUnit: 'canasta',
    description: 'Fresas dulces cultivadas sin químicos en Puracé, ideales para postres o consumo fresco.',
    image: 'https://images.unsplash.com/photo-1518110996637-5264b3cdcbac?q=80&w=800&auto=format&fit=crop',
    stock: 15,
    isService: false,
    providerId: 'prov_lucia'
  },
  // Oficios Hogar
  {
    id: 'item_plomeria_fugas',
    name: 'Reparación de Fugas en Tuberías',
    category: 'oficios_hogar',
    price: 50000,
    priceUnit: 'servicio',
    description: 'Detección y sellado de fugas en tuberías de agua potable o desagües en viviendas de Popayán.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    stock: 10,
    isService: true,
    providerId: 'prov_julio',
    acceptsBarter: true,
    barterPreferences: 'Mercado campesino o almuerzos',
    estimatedBarterValue: 50
  },
  // Gastronomía
  {
    id: 'item_empanadas',
    name: 'Docena de Empanadas de Pipián',
    category: 'gastronomia',
    price: 24000,
    priceUnit: 'docena',
    description: 'Las auténticas empanadas de Popayán, rellenas de papa colorada y maní, acompañadas del mejor ají de maní.',
    image: 'https://images.unsplash.com/photo-1626074961564-9eb41094f997?q=80&w=800&auto=format&fit=crop',
    stock: 40,
    isService: false,
    providerId: 'prov_teresa',
    acceptsBarter: true,
    barterPreferences: 'Reparaciones locativas o insumos para cocina (aceite, masa)',
    estimatedBarterValue: 24
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_1',
    timeSlot: '14:30 - 16:00',
    clientName: 'Daniela Montes',
    category: 'oficios_hogar',
    itemName: 'Reparación de Fugas en Tuberías',
    price: 50000,
    distance: '2.4 km',
    status: 'confirmed',
    date: '2026-06-01'
  }
];

export const INITIAL_REQUESTS: UserRequest[] = [
  {
    id: 'req_1',
    category: 'gastronomia',
    address: 'Barrio La Ladera, Popayán',
    date: 'Jun 2, 2026',
    time: '10:00 AM',
    details: 'Solicito servicio de catering con 50 tamales de pipián para un evento familiar.',
    priceOffer: 250000,
    status: 'broadcasted'
  }
];

const KEYS = {
  PROVIDERS: 'fluid_mp_providers',
  ITEMS: 'fluid_mp_items',
  APPOINTMENTS: 'fluid_mp_appointments',
  REQUESTS: 'fluid_mp_requests',
  CURRENT_USER: 'fluid_mp_curr_user',
  CURRENT_ROLE: 'fluid_mp_curr_role', // 'client' | 'provider'
  SELECTED_PROVIDER_ID: 'fluid_mp_sel_prov'
};

export const getStorageData = () => {
  if (localStorage.getItem('fluid_mp_version') !== 'v7_fallback_images') {
    localStorage.clear();
    localStorage.setItem('fluid_mp_version', 'v7_fallback_images');
  }

  if (!localStorage.getItem(KEYS.PROVIDERS)) {
    localStorage.setItem(KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
  }
  if (!localStorage.getItem(KEYS.ITEMS)) {
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
  }
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  }
  if (!localStorage.getItem(KEYS.REQUESTS)) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify({
      name: 'Leonardo Bastidas',
      email: 'leonardo@unicauca.edu.co',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      address: 'Calle 5 # 4-12, Popayán'
    }));
  }
  if (!localStorage.getItem(KEYS.CURRENT_ROLE)) {
    localStorage.setItem(KEYS.CURRENT_ROLE, 'client');
  }
  if (!localStorage.getItem(KEYS.SELECTED_PROVIDER_ID)) {
    localStorage.setItem(KEYS.SELECTED_PROVIDER_ID, 'prov_marta');
  }

  return {
    providers: JSON.parse(localStorage.getItem(KEYS.PROVIDERS) || '[]') as ProviderProfile[],
    items: JSON.parse(localStorage.getItem(KEYS.ITEMS) || '[]') as ProductServiceItem[],
    appointments: JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]') as Appointment[],
    requests: JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]') as UserRequest[],
    currentUser: JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || '{}'),
    currentRole: localStorage.getItem(KEYS.CURRENT_ROLE) as 'client' | 'provider',
    selectedProviderId: localStorage.getItem(KEYS.SELECTED_PROVIDER_ID) || 'prov_marta'
  };
};

export const saveStorageData = (data: {
  providers?: ProviderProfile[];
  items?: ProductServiceItem[];
  appointments?: Appointment[];
  requests?: UserRequest[];
  currentRole?: 'client' | 'provider';
  selectedProviderId?: string;
}) => {
  if (data.providers) localStorage.setItem(KEYS.PROVIDERS, JSON.stringify(data.providers));
  if (data.items) localStorage.setItem(KEYS.ITEMS, JSON.stringify(data.items));
  if (data.appointments) localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
  if (data.requests) localStorage.setItem(KEYS.REQUESTS, JSON.stringify(data.requests));
  if (data.currentRole) localStorage.setItem(KEYS.CURRENT_ROLE, data.currentRole);
  if (data.selectedProviderId) localStorage.setItem(KEYS.SELECTED_PROVIDER_ID, data.selectedProviderId);
};
