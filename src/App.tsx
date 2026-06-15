import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis, Tooltip } from 'recharts'
import { generateMockData } from './data/mockData'
import DetailModal from './components/DetailModal'
import './App.css'

function MapFlyTo({ center, zoom }: { center: [number, number] | null, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function App() {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);
  const selectedKabRef = useRef<string | null>(null); // To fix stale closure in Leaflet events
  const [dpcData, setDpcData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetch('/jateng.json')
      .then(res => res.json())
      .then(data => {
        // Simulasi status jaringan (Banjarnegara pasti Online, sisanya random)
        const enrichedFeatures = data.features.map((f: any) => {
          const kabName = (f.properties.NAME_2 || f.properties.WADMKK || '').toUpperCase();
          f.properties.isOnline = kabName.includes('BANJARNEGARA') ? true : Math.random() > 0.5;
          return f;
        });
        setGeoData({ ...data, features: enrichedFeatures });
        
        // Hitung total online
        const totalOnline = enrichedFeatures.filter((f: any) => f.properties.isOnline).length;
        setGeoData((prev: any) => ({...prev, stats: { total: enrichedFeatures.length, online: totalOnline }}));
      })
      .catch(err => console.error("Error loading GeoJSON", err));
  }, []);

  useEffect(() => {
    if (!selectedKabupaten) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setDpcData(generateMockData(selectedKabupaten));
      } catch (error) {
        console.error("Gagal menarik data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedKabupaten]);

  // Leaflet Styling dinamis berdasarkan status online
  const getGeoJsonStyle = (feature: any) => {
    const isOnline = feature?.properties?.isOnline;
    return {
      fillColor: isOnline ? '#ef4444' : '#7f1d1d', // red-500 jika online, red-900 jika offline
      weight: 1.5,
      opacity: 0.7,
      color: isOnline ? '#b91c1c' : '#450a0a', 
      fillOpacity: isOnline ? 0.2 : 0.2, // Transparansi tinggi agar nama daerah di peta terbaca
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const kabName = feature.properties.NAME_2 || feature.properties.WADMKK || "Kabupaten";
    const isOnline = feature.properties.isOnline;
    
    // Tooltip dengan indikator warna
    const tooltipContent = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${isOnline ? '#22c55e' : '#737373'}; box-shadow: 0 0 5px ${isOnline ? '#22c55e' : '#000'};"></div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 900; line-height: 1;">${kabName}</span>
          <span style="font-size: 9px; color: ${isOnline ? '#4ade80' : '#a3a3a3'}; text-transform: uppercase;">${isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    `;
    layer.bindTooltip(tooltipContent, { className: 'custom-tooltip', sticky: true });

    layer.on({
      mouseover: (e: any) => {
        const target = e.target;
        target.setStyle({
          fillColor: isOnline ? '#dc2626' : '#991b1b', // hover color
          weight: 2,
          color: '#ffffff',
          fillOpacity: 0.4,
        });
        target.bringToFront();
      },
      mouseout: (e: any) => {
        const target = e.target;
        if (selectedKabRef.current !== kabName) {
          target.setStyle(getGeoJsonStyle(feature));
        } else {
          target.setStyle({
            fillColor: '#b91c1c', // Pastikan warna merah solid saat terpilih
            weight: 2,
            color: '#ffffff',
            fillOpacity: 0.5,
          });
        }
      },
      click: (e: any) => {
        setSelectedKabupaten(kabName);
        selectedKabRef.current = kabName; // Update ref
        setMapCenter([e.latlng.lat, e.latlng.lng]);
        
        e.target._map.eachLayer((l: any) => {
          if (l.feature && l.feature.properties) {
            if (l !== e.target) {
              l.setStyle(getGeoJsonStyle(l.feature));
            }
          }
        });
        
        e.target.setStyle({
          fillColor: '#b91c1c',
          weight: 2,
          color: '#ffffff',
          fillOpacity: 0.5,
        });
        e.target.bringToFront();
      }
    });
  };

  return (
    <div className="h-screen bg-neutral-900 text-white font-sans w-full flex flex-col overflow-hidden">
      {/* Detail Modal Full Screen */}
      {showDetail && selectedKabupaten && dpcData && (
        <DetailModal 
          kabupaten={selectedKabupaten} 
          data={dpcData} 
          onClose={() => setShowDetail(false)} 
        />
      )}

      {/* Header */}
      <header className="bg-pdip-black border-b border-red-900/30 p-4 flex justify-between items-center z-50 shadow-md">
        <div>
          <h1 className="text-xl font-black text-red-600 tracking-tight flex items-center gap-3">
            <img src="/logo_black.png" alt="PDIP Logo" className="h-8 w-auto object-contain" />
            DPD PDIP JATENG
          </h1>
          <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-widest font-bold">Command Center Dashboard</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-xs font-bold px-3 py-1 bg-red-950 text-red-400 rounded-full border border-red-900/50 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            Jaringan DPC: {geoData?.stats?.online || 0}/{geoData?.stats?.total || 35} Online
          </div>
          <div className="text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1 rounded-md border border-neutral-700">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Main Layout (Map + Sidebar) */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Map Area */}
        <div className="flex-1 relative z-0">
          <MapContainer center={[-7.2, 110.1402]} zoom={8.8} zoomSnap={0.1} zoomControl={false} className="w-full h-full">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {geoData && <GeoJSON data={geoData} style={getGeoJsonStyle} onEachFeature={onEachFeature} />}
            <MapFlyTo center={mapCenter} zoom={10} />
          </MapContainer>

          <div className="absolute top-4 left-4 z-[400] pointer-events-none">
            <h2 className="text-2xl font-black text-white drop-shadow-lg">Peta Kekuatan Jawa Tengah</h2>
            <p className="text-sm text-neutral-300 drop-shadow-md">Klik pada area kabupaten/kota untuk memuat data live DPC.</p>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full md:w-96 bg-neutral-900 border-l border-neutral-800 z-10 flex flex-col shadow-2xl transition-all duration-300">
          {!selectedKabupaten ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pilih Kabupaten</h3>
                <p className="text-sm text-neutral-400">Klik salah satu wilayah di peta untuk memuat data live dari server DPC terkait.</p>
             </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-neutral-800 bg-neutral-800/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-2xl text-white uppercase tracking-tight leading-tight">{selectedKabupaten}</h3>
                  <button onClick={() => setSelectedKabupaten(null)} className="text-neutral-500 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-full p-1 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded flex items-center gap-1.5 border ${loading || dpcData?.overview?.status === 'Offline' ? 'bg-yellow-950 text-yellow-500 border-yellow-900' : 'bg-green-950 text-green-500 border-green-900'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : (dpcData?.overview?.status === 'Offline' ? 'bg-neutral-500' : 'bg-green-500')}`}></div>
                      {loading ? 'Menghubungkan...' : `Status: ${dpcData?.overview?.status}`}
                    </span>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-24 bg-neutral-800 rounded-xl w-full"></div>
                    <div className="h-24 bg-neutral-800 rounded-xl w-full"></div>
                    <div className="h-16 bg-neutral-800 rounded-xl w-full"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Kader</p>
                        <p className="text-2xl font-black text-white mt-1">{dpcData?.overview?.kader.toLocaleString('id-ID')}</p>
                      </div>
                      
                      <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                        </div>
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Total Relawan</p>
                        <p className="text-2xl font-black text-red-500 mt-1">{dpcData?.overview?.relawan.toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="bg-neutral-800 p-5 rounded-xl border border-neutral-700">
                      <p className="text-xs text-neutral-400 font-bold uppercase mb-3">Simulasi Kekuatan Suara</p>
                      <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dpcData?.suaraPartai} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 10}} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: '#262626'}} contentStyle={{backgroundColor: '#171717', borderColor: '#3f3f46', borderRadius: '8px'}} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                              {dpcData?.suaraPartai.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-800 p-5 rounded-xl border border-neutral-700">
                      <div className="flex justify-between items-end mb-3">
                        <p className="text-xs text-neutral-400 font-bold uppercase">Coverage TPS</p>
                        <span className="text-lg font-black text-white">{dpcData?.overview?.tpsCovered}%</span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full relative" style={{ width: `${dpcData?.overview?.tpsCovered}%` }}></div>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      <button 
                        onClick={() => setShowDetail(true)}
                        className="w-full py-3.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-colors border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 group"
                      >
                        <svg className="w-5 h-5 text-red-300 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        <span>Lihat Laporan Lengkap DPC</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
