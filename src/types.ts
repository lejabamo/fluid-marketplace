/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceCategory = 
  | 'productos_aseo'   // Jabones y útiles de aseo
  | 'artesanias'       // Artesanías
  | 'agro_local'       // Productos agrícolas / campesinos
  | 'oficios_hogar'    // Oficios y reparaciones
  | 'confecciones'     // Ropa y confecciones locales
  | 'gastronomia';     // Comida típica y panadería

export interface ProductServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  priceUnit: string; // 'hora', 'servicio', 'unidad', etc.
  description: string;
  image: string;
  stock: number; // For inventory management
  isService: boolean; // true = service (hours/labor), false = merchandise (crafts/tangible product with physical stock)
  providerId: string;
  acceptsBarter?: boolean; // Marketing & Trueque focus
  barterPreferences?: string; // What they are willing to trade for
  estimatedBarterValue?: number; // Sistema de medidas: Valor de referencia para trueques (en Créditos/Puntos o COP)
}

export interface ProviderProfile {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  skills: string[];
  isOnline: boolean;
  earningsToday: number;
}

export interface Appointment {
  id: string;
  timeSlot: string;
  clientName: string;
  category: ServiceCategory;
  itemName: string;
  price: number;
  distance: string;
  status: 'pending' | 'confirmed' | 'completed';
  date: string;
}

export interface UserRequest {
  id: string;
  category: ServiceCategory;
  address: string;
  date: string;
  time: string;
  details: string;
  priceOffer: number;
  status: 'broadcasted' | 'countered' | 'accepted' | 'barter_proposed';
  counterPrice?: number;
  providerId?: string; // accepted by
  isBarterProposal?: boolean;
  barterOfferDescription?: string;
  barterEstimatedValue?: number; // Sistema de medidas para la oferta de trueque
  targetItemId?: string; // Para ofertas directas a un producto/servicio
  targetItemName?: string;
}
