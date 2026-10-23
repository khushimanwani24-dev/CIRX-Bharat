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
    layersGroupRef.current.clearLayers();

    const facilityMap = new Map<string, Facility>();
    facilities.forEach((f) => facilityMap.set(f.id, f));

    // 1. Draw Symbiosis Flowlines first (so markers sit on top)
    matches.forEach((match) => {
      const supply = streams.find((s) => s.id === match.supply_stream_id);
      const demand = streams.find((s) => s.id === match.demand_stream_id);
      if (!supply || !demand) return;

      const genFac = facilityMap.get(supply.facility_id);
      const offFac = facilityMap.get(demand.facility_id);
      if (!genFac || !offFac) return;

      // Filter check
      if (filterType === 'HAZARDOUS' && !supply.is_hazardous) return;
      if (filterType === 'NON_HAZARDOUS' && supply.is_hazardous) return;

      const isSelected = selectedMatchId === match.id;
      const isUnlocked = isConsentUnlocked(match, activeRole);

      const genCoord = useExactCoords || isUnlocked
        ? [genFac.coordinates.lat, genFac.coordinates.lng]
        : [
            getBlurredCoordinates(genFac.id, genFac.coordinates.lat, genFac.coordinates.lng).lat,
            getBlurredCoordinates(genFac.id, genFac.coordinates.lat, genFac.coordinates.lng).lng,
          ];

      const offCoord = useExactCoords || isUnlocked
        ? [offFac.coordinates.lat, offFac.coordinates.lng]
        : [
            getBlurredCoordinates(offFac.id, offFac.coordinates.lat, offFac.coordinates.lng).lat,
            getBlurredCoordinates(offFac.id, offFac.coordinates.lat, offFac.coordinates.lng).lng,
          ];

      const lineColor = isSelected
        ? '#10b981' // Bright Emerald for selected
        : supply.is_hazardous
        ? '#f43f5e' // Rose for hazardous match
        : '#06b6d4'; // Cyan for non-hazardous

      const polyline = L.polyline([genCoord, offCoord], {
        color: lineColor,
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 0.95 : 0.6,
        dashArray: isSelected ? '8, 8' : '4, 6',
      });

      polyline.on('click', () => {
        onSelectMatch(match.id);
      });

      // Midpoint tooltip
      const midLat = (genCoord[0] + offCoord[0]) / 2;
      const midLng = (genCoord[1] + offCoord[1]) / 2;

      if (isSelected) {
        const midMarker = L.circleMarker([midLat, midLng], {
          radius: 6,
          fillColor: '#10b981',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        });

        midMarker.bindTooltip(
          `<div class="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-emerald-500">
            ${match.match_score}% Match • ${match.transit_distance_km} km • ${match.avoided_co2_mt} MT CO₂e
          </div>`,
          { permanent: true, direction: 'top', className: 'custom-leaflet-tooltip' }
        );
        layersGroupRef.current.addLayer(midMarker);
      }

      layersGroupRef.current.addLayer(polyline);
    });

    // 2. Render Facilities
    facilities.forEach((fac) => {
      const isPrivileged = activeRole === 'REGULATOR_SPCB' || activeRole === 'CLUSTER_ADMIN';
      const facilityStreams = streams.filter((s) => s.facility_id === fac.id);
      const isHazardous = facilityStreams.some((s) => s.is_hazardous);

      // Determine pin type & color
      let pinColor = '#10b981'; // Green: Circular consumer
      let pinType = 'CONSUMER';
      let pinBorder = '#059669';

      if (fac.facility_type === 'RECOVERY_HUB') {
        pinColor = '#06b6d4'; // Cyan/Blue: Hydrometallurgy & Recovery Hub
        pinType = 'RECOVERY HUB';
        pinBorder = '#0891b2';
      } else if (fac.facility_type === 'GENERATOR') {
        if (isHazardous) {
          pinColor = '#f43f5e'; // Red/Rose: Hazardous Generator
          pinType = 'HAZARDOUS GENERATOR';
          pinBorder = '#e11d48';
        } else {
          pinColor = '#f59e0b'; // Amber: Non-haz Generator
          pinType = 'BYPRODUCT GENERATOR';
          pinBorder = '#d97706';
        }
      }

      const coord = useExactCoords || isPrivileged
        ? [fac.coordinates.lat, fac.coordinates.lng]
        : [
            getBlurredCoordinates(fac.id, fac.coordinates.lat, fac.coordinates.lng).lat,
            getBlurredCoordinates(fac.id, fac.coordinates.lat, fac.coordinates.lng).lng,
          ];

      const displayName = isPrivileged ? fac.legal_name : fac.anonymous_label;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: #0f172a;
            border: 2px solid ${pinColor};
            border-radius: 50%;
            box-shadow: 0 0 15px ${pinColor}66;
            cursor: pointer;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: ${pinColor};
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(coord, { icon: customIcon });

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
        <div style="padding: 12px; min-width: 240px; font-family: sans-serif;">
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
            <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #94a3b8;">Registered Streams:</div>
            ${streamListHtml}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      layersGroupRef.current.addLayer(marker);
    });
  };

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
      {/* Map Header Overlay Bar */}
      <div className="absolute top-4 left-4 z-[500] flex flex-wrap items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 shadow-xl max-w-[90%]">
        <div className="flex items-center gap-2 mr-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white font-mono">Nashik Industrial Corridor</span>
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
          <span>{useExactCoords ? 'Exact GIS Coordinates' : 'Privacy Radius (+/- 1.5 km Blurred)'}</span>
        </button>
      </div>

      {/* Selected Match Inspection Card (Bottom Right Floating) */}
      {selectedMatch && (
        <div className="absolute bottom-6 left-4 z-[500] w-80 bg-slate-950/95 backdrop-blur-md rounded-xl border border-emerald-500/40 p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active Symbiosis Route
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {selectedMatch.match_score}% Score
            </span>
          </div>

          <div className="mt-2 text-xs font-semibold text-white">
            Transit Distance: <span className="font-mono text-emerald-300">{selectedMatch.transit_distance_km} km</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Avoided Carbon: <span className="font-mono text-teal-300">{selectedMatch.avoided_co2_mt} MT CO₂e/mo</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Recommended Fleet: <span className="text-slate-200">{selectedMatch.recommended_logistics_mode}</span>
          </div>

          <button
            onClick={() => onSelectMatch(selectedMatch.id)}
            className="w-full mt-3 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
          >
            Open in Exchange Center
          </button>
        </div>
      )}

      {/* Map Legend Overlay (Top Right) */}
      <div className="absolute top-4 right-4 z-[500] bg-slate-950/90 backdrop-blur-md px-3.5 py-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2">
        <div className="font-mono font-bold text-slate-300 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Corridor Legend
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
          <span>Symbiosis Material Flowline</span>
        </div>
      </div>

      {/* Actual Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
