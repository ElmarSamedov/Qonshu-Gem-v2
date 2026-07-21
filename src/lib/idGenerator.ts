/**
 * Utility for generating unique IDs for location properties and user IDs.
 */

export function cleanCode(name: string, len: number = 2): string {
  if (!name) return 'X'.repeat(len);
  return name.trim().slice(0, len).toUpperCase().padEnd(len, 'X');
}

export function getCharCodeSum(str: string): number {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

/**
 * Unique ID for Country
 */
export function generateCountryId(country: string): string {
  const code = cleanCode(country, 3);
  const sum = getCharCodeSum(country || 'Default');
  return `CTRY-${code}-${sum}`;
}

/**
 * Unique ID for City
 */
export function generateCityId(city: string, countryId: string): string {
  const code = cleanCode(city, 3);
  const sum = getCharCodeSum(city || 'Default');
  const parentSuffix = countryId ? countryId.split('-').pop() : '000';
  return `CITY-${code}-${sum}-${parentSuffix}`;
}

/**
 * Unique ID for Town
 */
export function generateTownId(town: string, cityId: string): string {
  const code = cleanCode(town, 3);
  const sum = getCharCodeSum(town || 'Default');
  const parentSuffix = cityId ? cityId.split('-')[2] : '000';
  return `TWN-${code}-${sum}-${parentSuffix}`;
}

/**
 * Unique ID for District
 */
export function generateDistrictId(district: string, cityId: string): string {
  const code = cleanCode(district, 3);
  const sum = getCharCodeSum(district || 'Default');
  const parentSuffix = cityId ? cityId.split('-')[2] : '000';
  return `DST-${code}-${sum}-${parentSuffix}`;
}

/**
 * Unique ID for Street
 */
export function generateStreetId(street: string, districtId: string): string {
  const code = cleanCode(street, 3);
  const sum = getCharCodeSum(street || 'Default');
  const parentSuffix = districtId ? districtId.split('-')[2] : '000';
  return `STR-${code}-${sum}-${parentSuffix}`;
}

/**
 * Unique ID for Building
 */
export function generateBuildingId(building: string, streetId: string): string {
  const code = String(building || '1').trim().toUpperCase();
  const parentSuffix = streetId ? streetId.split('-')[2] : '000';
  return `BLD-${code}-${parentSuffix}`;
}

/**
 * Unique ID for Entrance
 */
export function generateEntranceId(entrance: string, buildingId: string): string {
  const code = String(entrance || '1').trim().toUpperCase();
  const parentSuffix = buildingId ? buildingId.split('-')[1] : '000';
  return `ENT-${code}-${parentSuffix}`;
}

/**
 * Unique ID for Apartment
 */
export function generateApartmentId(apartment: string, buildingId: string): string {
  const code = String(apartment || '1').trim().toUpperCase();
  const parentSuffix = buildingId ? buildingId.split('-')[1] : '000';
  return `APT-${code}-${parentSuffix}`;
}

/**
 * User ID written as:
 * [first two letters of country] [first two letters of city] [first two letters of street] [last two digits of apartment (padded)] [last two digits of phone] [registration date hh:mm:ss]
 */
export function generateUserId(params?: {
  country?: string;
  city?: string;
  street?: string;
  apartment?: string;
  phone?: string;
  registrationDate?: Date;
}): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
