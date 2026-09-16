import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { Facility, Referral, Patient, Priority } from '../types';
import {
  MapPin,
  Navigation,
  Activity,
  Layers,
  Search,
  Building2,
  Stethoscope,
  Phone,
  Clock,
  Ambulance,
  AlertTriangle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Send,
  Video,
  ExternalLink,
  Users,
  Compass,
  Bed,
  ShieldCheck,
  ChevronRight,
  X,
  Filter,
  Eye,
} from 'lucide-react';

export const HealthcareMap: React.FC = () => {
  const {
    facilities,
    referrals,
    patients,
    setCurrentView,
    setSelectedPatientId,
    setSelectedReferralId,
    showToast,
  } = useApp();
  const { t } = useTranslation();

  // Active selected item for interactive inspection
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'patient' | 'referral' | 'facility';
    id: string;
  }>({
    type: 'patient',
    id: 'PID-2026-8891',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'District Hospital' | 'PHC' | 'Sub-Centre'>('all');

  // Layer toggles
  const [showPatients, setShowPatients] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  // Active items in transit
  const transitReferrals = useMemo(() => {
    return referrals.filter(
      (r) => r.transitInfo && (r.status === 'Pending' || r.status === 'In Consultation' || r.priority === 'Emergency')
    );
  }, [referrals]);

  // Selected item details
  const activePatient = useMemo(() => {
    if (selectedEntity.type === 'patient') {
      return patients.find((p) => p.id === selectedEntity.id) || patients[0];
    }
    return null;
  }, [selectedEntity, patients]);

  const activeReferral = useMemo(() => {
    if (selectedEntity.type === 'referral') {
      return referrals.find((r) => r.id === selectedEntity.id) || referrals[0];
    }
    return null;
  }, [selectedEntity, referrals]);

  const activeFacility = useMemo(() => {
    if (selectedEntity.type === 'facility') {
      return facilities.find((f) => f.id === selectedEntity.id) || facilities[0];
    }
    return facilities[0];
  }, [selectedEntity, facilities]);

  // 1. Initialize Leaflet Map Centered on Kurnool, Andhra Pradesh
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Kurnool, AP: 15.8281° N, 78.0373° E
    const map = L.map(mapContainerRef.current, {
      center: [15.75, 78.05],
      zoom: 10,
      minZoom: 7,
      maxZoom: 18,
      zoomControl: false,
    });

    // Dark Matter CartoDB tile layer matching app theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    routesLayerRef.current = routesGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Markers & Routes dynamically whenever filters/data change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const routesGroup = routesLayerRef.current;
    if (!map || !markersGroup || !routesGroup) return;

    markersGroup.clearLayers();
    routesGroup.clearLayers();

    // A. Render Facilities Markers
    if (showFacilities) {
      facilities.forEach((fac) => {
        if (!fac.coordinates) return;
        if (tierFilter !== 'all' && fac.type !== tierFilter) return;

        const isDH = fac.type === 'District Hospital';
        const isPHC = fac.type === 'PHC';

        const colorClass = isDH ? '#818cf8' : isPHC ? '#38bdf8' : '#34d399';
        const iconHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="width: 32px; height: 32px; border-radius: 10px; background: rgba(15, 23, 42, 0.9); border: 2px solid ${colorClass}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
              <span style="font-size: 14px; line-height: 1;">🏥</span>
            </div>
            <div style="position: absolute; bottom: -18px; white-space: nowrap; background: rgba(2, 6, 23, 0.85); border: 1px solid rgba(148, 163, 184, 0.3); border-radius: 6px; padding: 1px 5px; font-size: 10px; font-weight: 700; color: #f1f5f9;">
              ${fac.name.replace('Hospital', 'Hosp.').replace('Sub-Centre', 'SC')}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-facility-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([fac.coordinates.lat, fac.coordinates.lng], { icon });
        marker.on('click', () => {
          setSelectedEntity({ type: 'facility', id: fac.id });
          map.flyTo([fac.coordinates!.lat, fac.coordinates!.lng], Math.max(map.getZoom(), 11), {
            duration: 0.8,
          });
        });
        marker.addTo(markersGroup);
      });
    }

    // B. Render Patient Markers
    if (showPatients) {
      patients.forEach((pat) => {
        if (!pat.coordinates) return;

        const riskColor =
          pat.riskLevel === 'Emergency'
            ? '#f43f5e'
            : pat.riskLevel === 'High'
            ? '#fb7185'
            : pat.riskLevel === 'Moderate'
            ? '#fbbf24'
            : '#34d399';

        const isSelected = selectedEntity.type === 'patient' && selectedEntity.id === pat.id;

        const iconHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: ${isSelected ? '28px' : '22px'}; height: ${isSelected ? '28px' : '22px'}; border-radius: 50%; background: ${riskColor}; border: 3px solid #0f172a; box-shadow: 0 0 14px ${riskColor}; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></span>
            </div>
            <div style="margin-top: 2px; white-space: nowrap; background: rgba(15, 23, 42, 0.9); border: 1px solid ${riskColor}; border-radius: 6px; padding: 1px 6px; font-size: 10px; font-weight: 800; color: #ffffff;">
              ${pat.name.split(' ')[0]} (${pat.age}y)
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-patient-marker',
          iconSize: [26, 36],
          iconAnchor: [13, 14],
        });

        const marker = L.marker([pat.coordinates.lat, pat.coordinates.lng], { icon });
        marker.on('click', () => {
          setSelectedEntity({ type: 'patient', id: pat.id });
          setSelectedPatientId(pat.id);
          map.flyTo([pat.coordinates!.lat, pat.coordinates!.lng], Math.max(map.getZoom(), 12), {
            duration: 0.8,
          });
        });
        marker.addTo(markersGroup);
      });
    }

    // C. Render Ambulances in Transit & Corridors
    if (showAmbulances) {
      transitReferrals.forEach((ref) => {
        if (!ref.coordinates || !ref.transitInfo) return;

        const isSelected = selectedEntity.type === 'referral' && selectedEntity.id === ref.id;
        const iconHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #e11d48; border: 2px solid #ffffff; box-shadow: 0 0 16px rgba(225, 29, 72, 0.8); display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite;">
              <span style="font-size: 14px; line-height: 1;">🚑</span>
            </div>
            <div style="margin-top: 3px; white-space: nowrap; background: #881337; border: 1px solid #f43f5e; border-radius: 6px; padding: 1px 6px; font-size: 9px; font-weight: 900; color: #fff;">
              ${ref.transitInfo.ambulanceNumber} • ETA ${ref.transitInfo.etaMinutes}m
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-ambulance-marker',
          iconSize: [36, 44],
          iconAnchor: [18, 16],
        });

        const marker = L.marker([ref.coordinates.lat, ref.coordinates.lng], { icon });
        marker.on('click', () => {
          setSelectedEntity({ type: 'referral', id: ref.id });
          setSelectedReferralId(ref.id);
          map.flyTo([ref.coordinates!.lat, ref.coordinates!.lng], Math.max(map.getZoom(), 12), {
            duration: 0.8,
          });
        });
        marker.addTo(markersGroup);

        // Render Highway Transit Corridor Polyline
        if (showCorridors) {
          // Approximate corridor route to Kurnool DH (15.8281, 78.0373)
          const corridorPath: [number, number][] = [
            [ref.coordinates.lat, ref.coordinates.lng],
            [(ref.coordinates.lat + 15.8281) / 2, (ref.coordinates.lng + 78.0373) / 2],
            [15.8281, 78.0373],
          ];

          L.polyline(corridorPath, {
            color: '#f43f5e',
            weight: 3,
            opacity: 0.75,
            dashArray: '8, 8',
          }).addTo(routesGroup);
        }
      });
    }
  }, [
    showFacilities,
    showPatients,
    showAmbulances,
    showCorridors,
    tierFilter,
    facilities,
    patients,
    transitReferrals,
    selectedEntity,
  ]);

  // Zoom helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };
  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };
  const handleReset = () => {
    mapInstanceRef.current?.flyTo([15.75, 78.05], 10, { duration: 1 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Overview KPI Banner */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>District Health GIS &amp; Emergency Telemetry • Andhra Pradesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {t('nav_healthcare_map', 'Healthcare Network & Transit Map')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Accurate geographic coordinates of Andhra Pradesh Sub-Centres, PHCs, District Hospitals, live 108 ambulance corridors, and community patient locations.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'all'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All Facilities ({facilities.length})
            </button>
            <button
              onClick={() => setTierFilter('District Hospital')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'District Hospital'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              District Hospital
            </button>
            <button
              onClick={() => setTierFilter('PHC')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'PHC'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Primary Health (PHCs)
            </button>
            <button
              onClick={() => setTierFilter('Sub-Centre')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'Sub-Centre'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Sub-Centres
            </button>
          </div>
        </div>

        {/* Live Network Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-teal-500/20 flex items-center gap-3">
            <div className="p-2 bg-teal-600/20 text-teal-400 border border-teal-500/30 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Connected Facilities</p>
              <p className="text-base font-extrabold text-slate-100">{facilities.length} Active Nodes</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-rose-500/30 flex items-center gap-3">
            <div className="p-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl">
              <Ambulance className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Live 108 Transits</p>
              <p className="text-base font-extrabold text-rose-400">{transitReferrals.length} In Transit</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Mapped Patients</p>
              <p className="text-base font-extrabold text-emerald-400">{patients.length} Community Cases</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Bed className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">District ICU Beds</p>
              <p className="text-base font-extrabold text-indigo-400">15 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Leaflet Andhra Pradesh Map */}
        <div className="lg:col-span-8 space-y-3">
          {/* Map Controls Header */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
            {/* Layer Toggles */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={showPatients}
                  onChange={(e) => setShowPatients(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 bg-slate-900 border-slate-700"
                />
                <span>Patients ({patients.length})</span>
              </label>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={showAmbulances}
                  onChange={(e) => setShowAmbulances(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-rose-600 bg-slate-900 border-slate-700"
                />
                <span>108 Ambulances</span>
              </label>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={showFacilities}
                  onChange={(e) => setShowFacilities(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-900 border-slate-700"
                />
                <span>Hospitals &amp; PHCs</span>
              </label>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={showCorridors}
                  onChange={(e) => setShowCorridors(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-teal-600 bg-slate-900 border-slate-700"
                />
                <span>Transit Routes</span>
              </label>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer ml-1"
                title="Reset View to Andhra Pradesh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Leaflet Real GIS Map Canvas */}
          <div className="relative w-full aspect-16/11 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Map Watermark / Overlay Legend */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-xl p-2.5 text-[10px] text-slate-300 space-y-1.5 shadow-xl">
              <div className="font-black text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Andhra Pradesh GIS Telemetry (OpenStreetMap)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Emergency Case
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Moderate
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Stable
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400"></span> Facility
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Entity Inspection Drawer */}
        <div className="lg:col-span-4 space-y-4">
          {/* Patient Details Card */}
          {selectedEntity.type === 'patient' && activePatient && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                    {activePatient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{activePatient.name}</h3>
                    <p className="text-xs text-slate-400">
                      {activePatient.age}y • {activePatient.gender} • PID: {activePatient.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    activePatient.riskLevel === 'Emergency'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : activePatient.riskLevel === 'High'
                      ? 'bg-pink-950 text-pink-300 border-pink-800'
                      : activePatient.riskLevel === 'Moderate'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {activePatient.riskLevel} Risk
                </span>
              </div>

              {/* Patient Location in AP */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Geographic Location (Andhra Pradesh)</span>
                </div>
                <p className="text-xs text-slate-200">{activePatient.address}</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Coordinates: {activePatient.coordinates?.lat.toFixed(4)}°N, {activePatient.coordinates?.lng.toFixed(4)}°E
                </p>
              </div>

              {/* Symptoms & Vitals */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current Symptoms &amp; Duration
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activePatient.symptoms.map((sym, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
                    >
                      {sym}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Temperature</p>
                    <p className="text-sm font-black text-rose-400">{activePatient.vitals.temperature}°F</p>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
                    <p className="text-sm font-black text-indigo-400">{activePatient.vitals.bloodPressure}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedPatientId(activePatient.id);
                    setCurrentView('patient_profile');
                  }}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Full Patient Profile</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPatientId(activePatient.id);
                    setCurrentView('smart_referral');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>Initiate Smart Referral</span>
                </button>

                <button
                  onClick={() => showToast(`Calling ${activePatient.name} at ${activePatient.phone}`, 'info')}
                  className="w-full py-2 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call: {activePatient.phone}</span>
                </button>
              </div>
            </div>
          )}

          {/* Referral Details Card */}
          {selectedEntity.type === 'referral' && activeReferral && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950 border border-teal-800 px-2.5 py-0.5 rounded">
                    {activeReferral.id}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1.5">{activeReferral.patientName}</h3>
                  <p className="text-xs text-slate-400">
                    {activeReferral.patientAge}y • {activeReferral.patientGender}
                  </p>
                </div>

                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-rose-950 text-rose-300 border-rose-800">
                  {activeReferral.priority}
                </span>
              </div>

              {/* Transit Info */}
              {activeReferral.transitInfo && (
                <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                      <Ambulance className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>108 Ambulance in Transit</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-rose-900/80 px-2 py-0.5 rounded">
                      ETA {activeReferral.transitInfo.etaMinutes} mins
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Vehicle: <strong>{activeReferral.transitInfo.ambulanceNumber}</strong> • Speed: {activeReferral.transitInfo.speedKmH} km/h
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Location: {activeReferral.transitInfo.currentLocationName}
                  </p>
                </div>
              )}

              {/* Route */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Inter-Facility Route</p>
                <p className="text-white font-semibold mt-1">
                  From: {activeReferral.fromFacility}
                </p>
                <p className="text-teal-400 font-semibold">
                  → To: {activeReferral.toFacility}
                </p>
              </div>

              {/* Reason */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Clinical Reason</p>
                <p className="text-slate-300 mt-1">{activeReferral.reason}</p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedReferralId(activeReferral.id);
                    setCurrentView('teleconsultation');
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Start WebRTC Teleconsultation</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedReferralId(activeReferral.id);
                    setCurrentView('referral_tracking');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>Track Referral Journey</span>
                </button>
              </div>
            </div>
          )}

          {/* Facility Details Card */}
          {selectedEntity.type === 'facility' && activeFacility && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {activeFacility.type}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1.5">{activeFacility.name}</h3>
                  <p className="text-xs text-slate-400">{activeFacility.location}</p>
                </div>
              </div>

              {/* Bed Capacity */}
              {activeFacility.bedAvailability && (
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Live Bed Telemetry</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Total Capacity</p>
                      <p className="text-base font-black text-white">{activeFacility.bedAvailability.total} Beds</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">ICU Available</p>
                      <p className="text-base font-black text-indigo-400">{activeFacility.bedAvailability.icuAvailable} ICU</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialists */}
              {activeFacility.specialistsAvailable && (
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Staff / Specialists on Duty</p>
                  <div className="flex flex-wrap gap-1">
                    {activeFacility.specialistsAvailable.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setCurrentView('smart_referral');
                    showToast(`Targeting ${activeFacility.name} for referral`, 'info');
                  }}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Refer Patient to this Facility</span>
                </button>

                {activeFacility.contactPhone && (
                  <button
                    onClick={() => showToast(`Calling ${activeFacility.name}: ${activeFacility.contactPhone}`, 'info')}
                    className="w-full py-2 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>Call Duty Desk: {activeFacility.contactPhone}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
