/**
 * Hotel Service Interface
 * Manages hotel & resort content library
 */

import { Hotel } from '@/lib/types/entities';

export interface IHotelService {
  getHotels(): Promise<Hotel[]>;
  getHotelById(id: string): Promise<Hotel | null>;
  createHotel(data: Partial<Hotel>): Promise<Hotel>;
  updateHotel(id: string, data: Partial<Hotel>): Promise<Hotel>;
  deleteHotel(id: string): Promise<boolean>;
  toggleActive(id: string): Promise<Hotel>;
}
