import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  generateCountryId, generateCityId, generateTownId, generateDistrictId, 
  generateStreetId, generateBuildingId, generateEntranceId, generateApartmentId
} from '../../lib/idGenerator';

export default function RegistrySection() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  const country = user?.country || 'Azerbaijan';
  const countryId = user?.countryId || generateCountryId(country);
  const city = user?.city || 'Baku';
  const cityId = user?.cityId || generateCityId(city, countryId);
  const town = user?.town || 'Sabail';
  const townId = user?.townId || generateTownId(town, cityId);
  const district = user?.district || 'Sabail';
  const districtId = user?.districtId || generateDistrictId(district, cityId);
  const street = user?.street || 'Nizami St';
  const streetId = user?.streetId || generateStreetId(street, districtId);
  const building = user?.building || '42';
  const buildingId = user?.buildingId || generateBuildingId(building, streetId);
  const entrance = user?.entrance || '2';
  const entranceId = user?.entranceId || generateEntranceId(entrance, buildingId);
  const apartment = user?.apartment || '15';
  const apartmentId = user?.apartmentId || generateApartmentId(apartment, buildingId);

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10">
      <CardHeader className="border-b border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          <CardTitle className="text-lg text-slate-900 dark:text-white">Durable Property Registry & Object IDs</CardTitle>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deterministic unique identifiers generated for each level of your property hierarchy.
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold uppercase tracking-wider">User ID (Deterministic Format)</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{(user as any).uid || (user as any).id}</span>
          </div>
        </div>
        
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {[
            { name: 'Country', val: country, idVal: countryId },
            { name: 'City', val: city, idVal: cityId },
            { name: 'Town', val: town, idVal: townId },
            { name: 'District', val: district, idVal: districtId },
            { name: 'Street', val: street, idVal: streetId },
            { name: 'Building', val: building, idVal: buildingId },
            { name: 'Entrance', val: entrance, idVal: entranceId },
            { name: 'Apartment', val: apartment, idVal: apartmentId },
          ].map((prop, idx) => (
            <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 font-medium block">{prop.name}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{prop.val}</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-white font-medium bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/10 dark:border-white/10">{prop.idVal}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">ASAN İmza / ASAN Login</h4>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded uppercase">Coming Soon</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Secure, state-verified digital identity integration is planned. This will replace the current SMS/GPS verification with a certified legal framework.
          </p>
          <button disabled className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 cursor-not-allowed">
            Connect ASAN İmza (Pending API)
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
