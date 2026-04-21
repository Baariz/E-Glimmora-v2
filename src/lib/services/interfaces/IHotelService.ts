/**
 * Hotel Service Interface
 * Manages hotel & resort content library
 */

import { Hotel } from '@/lib/types/entities';

/**
 * Hotel list filters per Hotels/Packages Frontend Integration Guide §4.1.
 * All query params are optional.
 */
export interface HotelQuery {
  region?: string;
  tier?: string;
  active?: boolean;
}

export interface IHotelService {
  getHotels(query?: HotelQuery): Promise<Hotel[]>;
  getHotelById(id: string): Promise<Hotel | null>;
  createHotel(data: Partial<Hotel>): Promise<Hotel>;
  updateHotel(id: string, data: Partial<Hotel>): Promise<Hotel>;
  deleteHotel(id: string): Promise<boolean>;
  toggleActive(id: string): Promise<Hotel>;
}
