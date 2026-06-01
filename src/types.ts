/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceCategory = 
  | 'aseo'           // Aseo Hogar
  | 'jardinera'      // Jardinería
  | 'plomeria'       // Plomería
  | 'artesanias'     // Artesanías (tangible goods with inventory stock)
  | 'electricista'   // Electricista
  | 'lavado_carros'; // Lavado de carros

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
  status: 'broadcasted' | 'countered' | 'accepted';
  counterPrice?: number;
  providerId?: string; // accepted by
}
