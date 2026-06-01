import { ProductServiceItem, ProviderProfile, Appointment, UserRequest, ServiceCategory } from './types';

export const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov_sarah',
    name: 'Sarah Jennings',
    specialty: 'Aseo de Hogar Premium',
    rating: 5.0,
    reviewsCount: 124,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    bio: 'Especialista certificada en limpieza profunda y desinfección ambiental. Utilizo productos ecológicos, seguros para niños y mascotas. Detallista y confiable con más de 5 años de servicio en residencias y oficinas.',
    location: 'Sectors Norte y Centro, CDMX',
    skills: ['Limpieza Profunda', 'Planchado & Lavandería', 'Organización Closet', 'Desinfección de Baños'],
    isOnline: true,
    earningsToday: 342.50
  },
  {
    id: 'prov_elena',
    name: 'Elena Rodríguez',
    specialty: 'Jardinería & Paisajismo',
    rating: 4.8,
    reviewsCount: 96,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
    bio: 'Graduada en paisajismo, ofrezco mantenimiento integral de jardines, poda de formación, diseño exterior y control ecológico de plagas. Hago que tu jardín sea un oasis sustentable y vibrante.',
    location: 'Sur, San Ángel y Coyoacán',
    skills: ['Diseño de Jardín', 'Sistema Riego', 'Poda Césped', 'Tratamiento de Tierra', 'Invernaderos'],
    isOnline: true,
    earningsToday: 180.00
  },
  {
    id: 'prov_marcus',
    name: 'Marcus Thorne',
    specialty: 'Plomería Residencial Experta',
    rating: 4.9,
    reviewsCount: 184,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    bio: 'Reparación e instalación técnica e hidráulica. Fugas rebeldes, calentadores, sanitarios, cisternas y destapes con equipo avanzado. Atención rápida las 24 horas para urgencias domésticas.',
    location: 'Condesa, Roma y Polanco',
    skills: ['Detección de Fugas', 'Instalación Boiler', 'Destape de Drenaje', 'Bombas de Presión'],
    isOnline: true,
    earningsToday: 430.00
  },
  {
    id: 'prov_carmen',
    name: 'Carmen Díaz',
    specialty: 'Artesana Textil & Cerámicas',
    rating: 4.9,
    reviewsCount: 112,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
    bio: 'Creadora artística local. Confecciono carteras de telar de cintura bordadas a mano y vajilla rústica de cerámica horneada a alta temperatura. Cada artículo lleva una narrativa milenaria y es único.',
    location: 'Oaxaca de Juárez (Envíos nacionales)',
    skills: ['Telar de Cintura', 'Modelado en Barro', 'Pintado a Mano', 'Tintes Orgánicos'],
    isOnline: true,
    earningsToday: 210.00
  },
  {
    id: 'prov_javier',
    name: 'Javier Ortiz',
    specialty: 'Electricista Autorizado',
    rating: 4.7,
    reviewsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    bio: 'Técnico electricista certificado. Cortocircuitos, cableado estructurado, tableros de control con termomagnéticos, iluminación LED y mantenimiento de subestaciones residenciales. Seguridad garantizada.',
    location: 'Área Metropolitana CDMX',
    skills: ['Cortos Circuitos', 'Instalaciones Nuevas', 'Tableros Eléctricos', 'Luminarias Smart'],
    isOnline: true,
    earningsToday: 195.00
  },
  {
    id: 'prov_mateo',
    name: 'Mateo Gómez',
    specialty: 'Detallado & Lavado Car Wash',
    rating: 4.9,
    reviewsCount: 88,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1ecc6f?q=80&w=800&auto=format&fit=crop',
    bio: 'Especialista en detallado automotriz ecológico a domicilio. Corrección de pintura, encerado híbrido, higienización de interiores con vapor caliente y limpieza profunda de tapicería.',
    location: 'Cuajimalpa y Santa Fe',
    skills: ['Pulido & Encerado', 'Lavado a Vapor', 'Restauración de Faros', 'Descontaminado Pintura'],
    isOnline: false,
    earningsToday: 120.00
  }
];

export const INITIAL_ITEMS: ProductServiceItem[] = [
  // Aseo Hogar
  {
    id: 'item_clean_standard',
    name: 'Limpieza Básica del Hogar',
    category: 'aseo',
    price: 30,
    priceUnit: 'hora',
    description: 'Barrer, trapear, sacudir, limpieza de cristales internos, tendido de camas, lavado de trastes básicos e higiene general de recámaras.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    stock: 24, // slot availability or general capacity
    isService: true,
    providerId: 'prov_sarah'
  },
  {
    id: 'item_clean_deep',
    name: 'Limpieza Profunda & Desinfección',
    category: 'aseo',
    price: 45,
    priceUnit: 'hora',
    description: 'Limpieza profunda de campanas, hornos, remoción de sarro difícil en azulejos, desinfección a vapor y aspirado especializado de colchones.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop',
    stock: 12,
    isService: true,
    providerId: 'prov_sarah'
  },
  
  // Jardinería
  {
    id: 'item_gardening_mow',
    name: 'Poda de Césped y Mantenimiento General',
    category: 'jardinera',
    price: 35,
    priceUnit: 'hora',
    description: 'Poda regular de pasto, perfilado de banquetas, eliminación de hierba mala, nutrientes foliares aplicados y poda simple de arbustos.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
    stock: 15,
    isService: true,
    providerId: 'prov_elena'
  },
  {
    id: 'item_gardening_design',
    name: 'Diseño de Jardines & Sustrato',
    category: 'jardinera',
    price: 60,
    priceUnit: 'servicio',
    description: 'Asesoría y diseño completo de paisajismo en espacios pequeños, incluyendo selección botánica decorativa e incorporación de abono orgánico.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=800&auto=format&fit=crop',
    stock: 5,
    isService: true,
    providerId: 'prov_elena'
  },

  // Plomería
  {
    id: 'item_plumb_detect',
    name: 'Detección & Reparación de Filtraciones',
    category: 'plomeria',
    price: 45,
    priceUnit: 'hora',
    description: 'Localización asistida de humedad o pérdidas internas en tuberías de cobre o PVC, reparación exprés y sellado de uniones críticas.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
    stock: 8,
    isService: true,
    providerId: 'prov_marcus'
  },
  {
    id: 'item_plumb_boiler',
    name: 'Instalación o Mantenimiento de Boiler',
    category: 'plomeria',
    price: 120,
    priceUnit: 'servicio',
    description: 'Limpieza e instalación técnica de calentadores solares, de gas instantáneos (paso) o almacenamiento. Incluye purga de líneas.',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
    stock: 10,
    isService: true,
    providerId: 'prov_marcus'
  },

  // Artesanías (PRODUCTOS FÍSICOS CON STOCK LIMITADO)
  {
    id: 'item_craft_bag',
    name: 'Bolso Artesanal "Telar de Mil Colores"',
    category: 'artesanias',
    price: 75,
    priceUnit: 'unidad',
    description: 'Cartera premium de telar hecha con hilos de algodón teñidos orgánicamente. Forro interior de lino con cierres de latón premium.',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
    stock: 14, // Real physically editable stock!
    isService: false,
    providerId: 'prov_carmen'
  },
  {
    id: 'item_craft_pottery',
    name: 'Juego de Tazas de Barro Negro Pulido',
    category: 'artesanias',
    price: 90,
    priceUnit: 'unidad',
    description: 'Set de 4 tazas rústicas de barro negro bruñido y horneado en pozo de leña. Acabado brillante natural sin aditivos químicos.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    stock: 8, // Real physically editable stock!
    isService: false,
    providerId: 'prov_carmen'
  },

  // Electricista
  {
    id: 'item_elec_short',
    name: 'Diagnóstico de Cortocircuitos Urgentes',
    category: 'electricista',
    price: 50,
    priceUnit: 'hora',
    description: 'Detección inmediata de fallas, sobrecargas y cables quemados. Reemplazo de fusibles dañados o pastillas térmicas principales.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    stock: 5,
    isService: true,
    providerId: 'prov_javier'
  },

  // Lavado de Carros
  {
    id: 'item_carwash_eco',
    name: 'Detallado Ecológico Completo a Domicilio',
    category: 'lavado_carros',
    price: 40,
    priceUnit: 'servicio',
    description: 'Lavado con polímeros biodegradables (sin manguera externa, ahorro del 95% de agua). Aspirado interior, lustrador de llantas y aromatizante orgánico.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1ecc6f?q=80&w=800&auto=format&fit=crop',
    stock: 12,
    isService: true,
    providerId: 'prov_mateo'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_1',
    timeSlot: '14:30 - 16:00',
    clientName: 'Daniela Montes',
    category: 'aseo',
    itemName: 'Limpieza Básica del Hogar',
    price: 90, // 3 horas
    distance: '2.4 km',
    status: 'confirmed',
    date: '2026-06-01'
  },
  {
    id: 'app_2',
    timeSlot: '09:00 - 11:30',
    clientName: 'Roberto Garza',
    category: 'jardinera',
    itemName: 'Poda de Césped y Mantenimiento',
    price: 87.5,
    distance: '4.1 km',
    status: 'completed',
    date: '2026-06-01'
  },
  {
    id: 'app_3',
    timeSlot: '17:00 - 19:00',
    clientName: 'Sofía Alcalá',
    category: 'plomeria',
    itemName: 'Reparación de Filtraciones',
    price: 90,
    distance: '1.2 km',
    status: 'pending',
    date: '2026-06-01'
  }
];

export const INITIAL_REQUESTS: UserRequest[] = [
  {
    id: 'req_1',
    category: 'aseo',
    address: 'Av. Paseo de la Reforma 222, San Rafael',
    date: 'Jun 2, 2026',
    time: '10:00 AM',
    details: 'Limpieza de departamento de 2 recámaras y lavado de ventanas exteriores incluidas. Ofrezco buena tarifa.',
    priceOffer: 50,
    status: 'broadcasted'
  },
  {
    id: 'req_2',
    category: 'plomeria',
    address: 'Ámsterdam 143, Condesa',
    date: 'Jun 2, 2026',
    time: '04:00 PM',
    details: 'Tubo de fregadero fracturado chorreando agua. Requiere plomero verificado urgente con herramientas propias.',
    priceOffer: 70,
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
  // Check if browser has data, else pre-populate
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
      name: 'Daniel Villamil',
      email: 'Daniel.V@ejemplo.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      address: 'Paseo de la Reforma 250, CDMX'
    }));
  }
  if (!localStorage.getItem(KEYS.CURRENT_ROLE)) {
    localStorage.setItem(KEYS.CURRENT_ROLE, 'client'); // default
  }
  if (!localStorage.getItem(KEYS.SELECTED_PROVIDER_ID)) {
    localStorage.setItem(KEYS.SELECTED_PROVIDER_ID, 'prov_sarah'); // default active provider for the "provider profile portal"
  }

  return {
    providers: JSON.parse(localStorage.getItem(KEYS.PROVIDERS) || '[]') as ProviderProfile[],
    items: JSON.parse(localStorage.getItem(KEYS.ITEMS) || '[]') as ProductServiceItem[],
    appointments: JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]') as Appointment[],
    requests: JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]') as UserRequest[],
    currentUser: JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || '{}'),
    currentRole: localStorage.getItem(KEYS.CURRENT_ROLE) as 'client' | 'provider',
    selectedProviderId: localStorage.getItem(KEYS.SELECTED_PROVIDER_ID) || 'prov_sarah'
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
