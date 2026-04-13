/**
 * Package Service Interface
 * Manages travel packages & itineraries
 */

import { Package } from '@/lib/types/entities';

export interface IPackageService {
  getPackages(): Promise<Package[]>;
  getActivePackages(): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | null>;
  createPackage(data: Partial<Package>): Promise<Package>;
  updatePackage(id: string, data: Partial<Package>): Promise<Package>;
  deletePackage(id: string): Promise<boolean>;
}
