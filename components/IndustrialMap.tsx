'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Facility,
  MaterialStream,
  MatchProposal,
} from '@/types';
import { UserRole } from './Header';
import { isConsentUnlocked, getBlurredCoordinates } from '@/lib/anonymizer';
import {
  Layers,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  Navigation,
  Compass,
  Zap,
  Sparkles,
  ArrowRight,
  Truck,
  Leaf,
  Droplets,
  Building2,
} from 'lucide-react';

interface IndustrialMapProps {
  facilities: Facility[];
  streams: MaterialStream[];
  matches: MatchProposal[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
  activeRole: UserRole;
}

export const IndustrialMap: React.FC<IndustrialMapProps> = ({
  facilities,
  streams,
  matches,
  selectedMatchId,
  onSelectMatch,
  activeRole,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  const [useExactCoords, setUseExactCoords] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'ALL' | 'HAZARDOUS' | 'NON_HAZARDOUS'>('ALL');

  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet in browser only
    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      // Center map around Nashik Industrial Corridor (Ambad / Satpur / Sinnar)
      const map = L.map(mapContainerRef.current, {
        center: [19.955, 73.745],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter Tiles for enterprise dark slate theme
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO | Nashik Industrial Symbiosis Corridor',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;

      renderMapElements(L);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Re-render markers and lines when props change
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    import('leaflet').then((LModule) => {
      renderMapElements(LModule.default);
    });
  }, [facilities, streams, matches, selectedMatchId, useExactCoords, filterType, activeRole]);

  const renderMapElements = (L: any) => {
    if (!layersGroupRef.current || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    layersGroupRef.current.clearLayers();

    const facilityMap = new Map<string, Facility>();
    facilities.forEach((f) => facilityMap.set(f.id, f));

    const streamMap = new Map<string, MaterialStream>();
    streams.forEach((s) => streamMap.set(s.id, s));

    // Find active match details if selected
    const activeMatch = matches.find((m) => m.id === selectedMatchId);
    let activeGenCoord: [number, number] | null = null;
    let activeOffCoord: [number, number] | null = null;
    let activeGenFacilityId: string | null = null;
    let activeOffFacilityId: string | null = null;

    if (activeMatch) {
      const s = streamMap.get(activeMatch.supply_stream_id);
      const d = streamMap.get(activeMatch.demand_stream_id);
      if (s && d) {
        activeGenFacilityId = s.facility_id;
        activeOffFacilityId = d.facility_id;
        const gFac = facilityMap.get(s.facility_id);
        const oFac = facilityMap.get(d.facility_id);
        if (gFac && oFac) {
          const isUnlocked = isConsentUnlocked(activeMatch, activeRole);
          const gC = useExactCoords || isUnlocked
            ? [gFac.coordinates.lat, gFac.coordinates.lng]
            : [
                getBlurredCoordinates(gFac.id, gFac.coordinates.lat, gFac.coordinates.lng).lat,
                getBlurredCoordinates(gFac.id, gFac.coordinates.lat, gFac.coordinates.lng).lng,
              ];
          const oC = useExactCoords || isUnlocked
            ? [oFac.coordinates.lat, oFac.coordinates.lng]
            : [
                getBlurredCoordinates(oFac.id, oFac.coordinates.lat, oFac.coordinates.lng).lat,
                getBlurredCoordinates(oFac.id, oFac.coordinates.lat, oFac.coordinates.lng).lng,
              ];
          activeGenCoord = [gC[0], gC[1]];
          activeOffCoord = [oC[0], oC[1]];
        }
      }
    }

    // 1. Draw Symbiosis Flowlines (Dashed Polylines)
    matches.forEach((match) => {
      const supply = streamMap.get(match.supply_stream_id);
      const demand = streamMap.get(match.demand_stream_id);
      if (!supply || !demand) return;

      const genFac = facilityMap.get(supply.facility_id);
      const offFac = facilityMap.get(demand.facility_id);
      if (!genFac || !offFac) return;

      // Filter check
      if (filterType === 'HAZARDOUS' && !supply.is_hazardous) return;
      if (filterType === 'NON_HAZARDOUS' && supply.is_hazardous) return;

      const isSelected = selectedMatchId === match.id;
      const isUnlocked = isConsentUnlocked(match, activeRole);

      const genCoord: [number, number] = useExactCoords || isUnlocked
        ? [genFac.coordinates.lat, genFac.coordinates.lng]
        : [
            getBlurredCoordinates(genFac.id, genFac.coordinates.lat, genFac.coordinates.lng).lat,
            getBlurredCoordinates(genFac.id, genFac.coordinates.lat, genFac.coordinates.lng).lng,
          ];

      const offCoord: [number, number] = useExactCoords || isUnlocked
        ? [offFac.coordinates.lat, offFac.coordinates.lng]
        : [
            getBlurredCoordinates(offFac.id, offFac.coordinates.lat, offFac.coordinates.lng).lat,
            getBlurredCoordinates(offFac.id, offFac.coordinates.lat, offFac.coordinates.lng).lng,
          ];

      if (isSelected) {
        // Render bright glowing halo line behind
        const haloLine = L.polyline([genCoord, offCoord], {
          color: '#10b981',
          weight: 10,
          opacity: 0.25,
        });
        layersGroupRef.current.addLayer(haloLine);

        // Render prominent animated dashed polyline
        const selectedPolyline = L.polyline([genCoord, offCoord], {
          color: '#10b981',
          weight: 4,
          opacity: 1.0,
          dashArray: '12, 10',
          className: 'symbiosis-flowline-active',
        });

        selectedPolyline.on('click', () => {
          onSelectMatch(match.id);
        });

        layersGroupRef.current.addLayer(selectedPolyline);

        // Midpoint marker with prominent tooltip
        const midLat = (genCoord[0] + offCoord[0]) / 2;
        const midLng = (genCoord[1] + offCoord[1]) / 2;

        const midMarker = L.circleMarker([midLat, midLng], {
          radius: 7,
          fillColor: '#10b981',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        });

        midMarker.bindTooltip(
          `<div style="font-family: monospace; font-weight: bold; background: #020617; color: #6ee7b7; padding: 4px 8px; border-radius: 6px; border: 1px solid #059669; box-shadow: 0 4px 12px rgba(0,0,0,0.8); font-size: 11px;">
            ⚡ ${match.match_score}% Match • ${match.transit_distance_km} km Haul • ${match.avoided_co2_mt} MT CO₂e Avoided
          </div>`,
          { permanent: true, direction: 'top', className: 'custom-leaflet-tooltip', offset: [0, -10] }
        );
        layersGroupRef.current.addLayer(midMarker);
      } else {
        // Subtle unselected route polyline
        const polyline = L.polyline([genCoord, offCoord], {
          color: supply.is_hazardous ? '#f43f5e' : '#06b6d4',
          weight: 2,
          opacity: 0.35,
          dashArray: '6, 8',
        });

        polyline.on('click', () => {
          onSelectMatch(match.id);
        });

        layersGroupRef.current.addLayer(polyline);
      }
    });

    // 2. Render Facilities Connected to Match State
    facilities.forEach((fac) => {
      const isPrivileged = activeRole === 'REGULATOR_SPCB' || activeRole === 'CLUSTER_ADMIN';
      const facilityStreams = streams.filter((s) => s.facility_id === fac.id);
      const isHazardous = facilityStreams.some((s) => s.is_hazardous);

      const isSelectedGenerator = activeGenFacilityId === fac.id;
      const isSelectedOfftaker = activeOffFacilityId === fac.id;
      const isNodeConnectedToActive = isSelectedGenerator || isSelectedOfftaker;

      // Determine pin type & base color
      let pinColor = '#10b981'; // Green: Circular consumer
      let pinType = 'CONSUMER';

      if (fac.facility_type === 'RECOVERY_HUB') {
        pinColor = '#06b6d4';
        pinType = 'RECOVERY HUB';
      } else if (fac.facility_type === 'GENERATOR') {
        if (isHazardous) {
          pinColor = '#f43f5e';
          pinType = 'HAZARDOUS GENERATOR';
        } else {
          pinColor = '#f59e0b';
          pinType = 'BYPRODUCT GENERATOR';
        }
      }

      const coord: [number, number] = useExactCoords || isPrivileged
        ? [fac.coordinates.lat, fac.coordinates.lng]
        : [
            getBlurredCoordinates(fac.id, fac.coordinates.lat, fac.coordinates.lng).lat,
            getBlurredCoordinates(fac.id, fac.coordinates.lat, fac.coordinates.lng).lng,
          ];

      const displayName = isPrivileged ? fac.legal_name : fac.anonymous_label;

      // Custom marker icon with pulsating halo if connected to active match
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isNodeConnectedToActive ? '40px' : '32px'};
            height: ${isNodeConnectedToActive ? '40px' : '32px'};
            background: #0f172a;
            border: 2px solid ${isNodeConnectedToActive ? '#ffffff' : pinColor};
            border-radius: 50%;
            box-shadow: ${
              isNodeConnectedToActive
                ? `0 0 25px ${pinColor}, 0 0 50px ${pinColor}99`
                : `0 0 12px ${pinColor}66`
            };
            cursor: pointer;
            transition: all 0.3s ease;
          ">
            <div style="
              width: ${isNodeConnectedToActive ? '16px' : '12px'};
              height: ${isNodeConnectedToActive ? '16px' : '12px'};
              background: ${pinColor};
              border-radius: 50%;
            "></div>
            ${
              isSelectedGenerator
                ? `<div style="position: absolute; bottom: -20px; white-space: nowrap; font-size: 9px; font-family: monospace; font-weight: bold; background: #991b1b; color: #fff; padding: 1px 5px; border-radius: 4px; border: 1px solid #f87171;">SOURCE: GEN</div>`
                : isSelectedOfftaker
                ? `<div style="position: absolute; bottom: -20px; white-space: nowrap; font-size: 9px; font-family: monospace; font-weight: bold; background: #065f46; color: #fff; padding: 1px 5px; border-radius: 4px; border: 1px solid #34d399;">TARGET: OFFTAKE</div>`
                : ''
            }
          </div>
        `,
        iconSize: [isNodeConnectedToActive ? 40 : 32, isNodeConnectedToActive ? 40 : 32],
        iconAnchor: [isNodeConnectedToActive ? 20 : 16, isNodeConnectedToActive ? 20 : 16],
      });

      const marker = L.marker(coord, { icon: customIcon });

      // Build Stream List HTML with interactive action buttons to connect symbiosis routes
      const facilityMatches = matches.filter((m) => {
        const s = streamMap.get(m.supply_stream_id);
        const d = streamMap.get(m.demand_stream_id);
        return s?.facility_id === fac.id || d?.facility_id === fac.id;
      });

      const matchLinksHtml = facilityMatches
        .map((m) => {
          const s = streamMap.get(m.supply_stream_id);
          const d = streamMap.get(m.demand_stream_id);
          const counterFacId = s?.facility_id === fac.id ? d?.facility_id : s?.facility_id;
          const counterFac = counterFacId ? facilityMap.get(counterFacId) : null;
          const counterName = counterFac ? (isPrivileged ? counterFac.legal_name : counterFac.anonymous_label) : 'Counterparty';

          return `
            <div style="margin-top: 6px; padding: 6px 8px; background: rgba(2, 6, 23, 0.9); border: 1px solid #059669; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-family: monospace; color: #6ee7b7; font-weight: bold;">
                ➔ ${counterName} (${m.match_score}%)
              </span>
              <button 
                onclick="window.selectSymbiosisRoute('${m.id}')"
                style="background: #059669; color: white; border: none; font-size: 9px; font-family: monospace; padding: 2px 6px; border-radius: 4px; cursor: pointer;"
              >
                Connect Polyline
              </button>
            </div>
          `;
        })
        .join('');

      const streamListHtml = facilityStreams
        .map(
          (s) => `
          <div style="margin-top: 6px; padding: 6px; background: rgba(15,23,42,0.8); border: 1px solid #334155; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
              <span style="color: ${s.is_hazardous ? '#fda4af' : '#6ee7b7'}; font-family: monospace;">${s.stream_type}: ${s.material_name}</span>
              <span style="color: #94a3b8;">${s.monthly_volume_mt} MT/mo</span>
            </div>
            <div style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 2px;">
              Code: ${s.cpcb_waste_code} • State: ${s.physical_state} • pH: ${s.ph_level ?? 'N/A'}
            </div>
          </div>
        `
        )
        .join('');

      const popupHtml = `
        <div style="padding: 12px; min-width: 260px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 9px; font-family: monospace; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${pinColor}22; color: ${pinColor}; border: 1px solid ${pinColor}44;">
              ${pinType}
            </span>
            <span style="font-size: 10px; color: #94a3b8;">${fac.cluster_zone}</span>
          </div>
          <div style="font-weight: bold; font-size: 13px; color: #f8fafc; margin-top: 4px;">
            ${displayName}
          </div>
          ${
            isPrivileged
              ? `<div style="font-size: 10px; font-family: monospace; color: #cbd5e1; margin-top: 2px;">GSTIN: ${fac.gstin}</div>`
              : `<div style="font-size: 10px; font-family: monospace; color: #64748b; margin-top: 2px;">Identity Protected by ReBharat Shield</div>`
          }

          <div style="margin-top: 8px;">
            <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #94a3b8;">Active Symbiosis Routes:</div>
            ${matchLinksHtml || '<div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 4px;">No match pairings active</div>'}
          </div>

          <div style="margin-top: 8px;">
            <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #94a3b8;">Registered Streams:</div>
            ${streamListHtml}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      layersGroupRef.current.addLayer(marker);
    });

    // Auto-frame map bounds around active symbiosis route if selected
    if (activeGenCoord && activeOffCoord) {
      try {
        const bounds = L.latLngBounds([activeGenCoord, activeOffCoord]);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 });
      } catch (e) {
        // ignore bounds fit errors
      }
    }
  };

  // Expose window handler for popup button click
  useEffect(() => {
    (window as any).selectSymbiosisRoute = (matchId: string) => {
      onSelectMatch(matchId);
    };
    return () => {
      delete (window as any).selectSymbiosisRoute;
    };
  }, [onSelectMatch]);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
      {/* Map Header Overlay Bar */}
      <div className="absolute top-4 left-4 z-[500] flex flex-wrap items-center gap-2.5 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 shadow-2xl max-w-[92%]">
        <div className="flex items-center gap-2 mr-1">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white font-mono">Nashik Industrial Corridor</span>
        </div>

        {/* Route Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedMatchId || ''}
            onChange={(e) => onSelectMatch(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-mono font-medium focus:outline-none cursor-pointer"
          >
            <option value="" disabled>Select Symbiosis Route...</option>
            {matches.map((m) => {
              const s = streams.find((str) => str.id === m.supply_stream_id);
              const d = streams.find((str) => str.id === m.demand_stream_id);
              const gFac = facilities.find((f) => f.id === s?.facility_id);
              const oFac = facilities.find((f) => f.id === d?.facility_id);
              const gName = gFac ? (activeRole === 'REGULATOR_SPCB' || activeRole === 'CLUSTER_ADMIN' ? gFac.legal_name : gFac.anonymous_label) : 'Gen';
              const oName = oFac ? (activeRole === 'REGULATOR_SPCB' || activeRole === 'CLUSTER_ADMIN' ? oFac.legal_name : oFac.anonymous_label) : 'Off';

              return (
                <option key={m.id} value={m.id} className="bg-slate-950 text-white">
                  Route #{m.id.toUpperCase()}: {gName} ➔ {oName} ({m.match_score}%)
                </option>
              );
            })}
          </select>
        </div>

        {/* Hazard Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Streams ({facilities.length})
          </button>
          <button
            onClick={() => setFilterType('HAZARDOUS')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              filterType === 'HAZARDOUS' ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hazardous (Cat 35.3 / 21.1)
          </button>
          <button
            onClick={() => setFilterType('NON_HAZARDOUS')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
              filterType === 'NON_HAZARDOUS' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Circular Byproducts
          </button>
        </div>

        {/* Privacy Coordinate Toggle */}
        <button
          onClick={() => setUseExactCoords(!useExactCoords)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
            useExactCoords
              ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
          }`}
          title="Toggle between exact PostGIS coordinates and blurred public +/- 1.5km privacy radius"
        >
          {useExactCoords ? <Eye className="w-3.5 h-3.5 text-slate-400" /> : <EyeOff className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{useExactCoords ? 'Exact PostGIS' : 'Privacy Blur (+/- 1.5 km)'}</span>
        </button>
      </div>

      {/* Selected Match Route Card (Floating Bottom Left) */}
      {selectedMatch && (
        <div className="absolute bottom-6 left-4 z-[500] w-88 bg-slate-950/95 backdrop-blur-md rounded-xl border border-emerald-500/50 p-4 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              Connected Symbiosis Polyline
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {selectedMatch.match_score}% Score
            </span>
          </div>

          <div className="text-xs font-mono text-white flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">Haul Distance:</span>
            <span className="font-bold text-emerald-300">{selectedMatch.transit_distance_km} km</span>
          </div>
          <div className="text-xs font-mono text-white flex items-center justify-between">
            <span className="text-slate-400">Avoided Carbon:</span>
            <span className="font-bold text-teal-300">{selectedMatch.avoided_co2_mt} MT CO₂e / mo</span>
          </div>
          <div className="text-xs font-mono text-white flex items-center justify-between">
            <span className="text-slate-400">Monthly Value:</span>
            <span className="font-bold text-amber-300">₹{selectedMatch.economic_benefit_inr.toLocaleString('en-IN')} / mo</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            Fleet: <span className="text-slate-200">{selectedMatch.recommended_logistics_mode}</span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onSelectMatch(selectedMatch.id)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition text-center font-mono"
            >
              Inspect Engineering Math
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay (Top Right) */}
      <div className="absolute top-4 right-4 z-[500] bg-slate-950/95 backdrop-blur-md px-3.5 py-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2">
        <div className="font-mono font-bold text-slate-300 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Corridor GIS Legend
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300" />
          <span>Hazardous Generator (Ambad)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
          <span>Non-Hazardous Generator</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-200" />
          <span>Hydrometallurgy Recovery Hub</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
          <span>Circular Consumer (Sinnar/Ambad)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 pt-1 border-t border-slate-800">
          <span className="w-6 h-0.5 border-t-2 border-dashed border-emerald-400" />
          <span className="text-emerald-300 font-mono text-[11px]">Active Symbiosis Polyline</span>
        </div>
      </div>

      {/* Actual Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
