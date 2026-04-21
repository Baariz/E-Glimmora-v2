/**
 * Package Service Interface
 * Manages travel packages & itineraries
 */

import { Package } from '@/lib/types/entities';

/**
 * Package list filters per Hotels/Packages Frontend Integration Guide §5.1.
 * All query params are optional.
 */
export interface PackageQuery {
  hotel_id?: string;
  category?: string;
  region?: string;
  active?: boolean;
}

export interface IPackageService {
  getPackages(query?: PackageQuery): Promise<Package[]>;
  getActivePackages(): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | null>;
  createPackage(data: Partial<Package>): Promise<Package>;
  updatePackage(id: string, data: Partial<Package>): Promise<Package>;
  deletePackage(id: string): Promise<boolean>;
  toggleActive(id: string): Promise<Package>;
}
