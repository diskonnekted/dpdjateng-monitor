import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { X, Users, Target, Clock, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface DetailModalProps {
  kabupaten: string;
  data: any;
  onClose: () => void;
}

export default function DetailModal({ kabupaten, data, onClose }: DetailModalProps) {
  if (!data) return null;

  const { pengurus, rekrutmen, timeline, laporan, kegiatan, suaraPartai } = data;
  const ktaPercentage = Math.round((rekrutmen.tercapaiKTA / rekrutmen.targetKTA) * 100);

  return (
    <div className="fixed inset-0 z-[1000] bg-neutral-950 flex flex-col animate-in slide-in-from-bottom-8 duration-500 text-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-4 bg-pdip-black border-b border-red-900/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-red-500/30 overflow-hidden">
             <img src="/logo_black.png" alt="PDIP Logo" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">DPC {kabupaten}</h2>
            <p className="text-red-400 text-sm font-bold tracking-widest">Laporan Analitik Komprehensif</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-red-900/50 rounded-full transition-colors group">
          <X className="w-8 h-8 text-neutral-400 group-hover:text-white" />
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Widget 1: Pengurus & Suara Partai */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16" /></div>
              <h3 className="text-lg font-bold text-neutral-300 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                Struktur KSB DPC
              </h3>
              <div className="space-y-4 relative z-10">
                {pengurus.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <div>
                      <p className="text-xs text-red-400 font-bold uppercase">{p.role}</p>
                      <p className="text-base font-bold text-white">{p.name}</p>
                    </div>
                    <span className="text-[10px] bg-green-950 text-green-500 px-2 py-1 rounded border border-green-900">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-neutral-300 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                Peta Kekuatan (Simulasi Suara)
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={suaraPartai} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#a3a3a3', fontSize: 12}} width={70} />
                    <Tooltip cursor={{fill: '#262626'}} contentStyle={{backgroundColor: '#171717', borderColor: '#3f3f46', borderRadius: '8px'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {suaraPartai.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Widget 2: Tracker KTA & Kegiatan */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gamifikasi KTA */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-neutral-300 mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                  Gamifikasi Rekrutmen KTA
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-32 h-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: rekrutmen.tercapaiKTA, fill: '#dc2626' },
                            { value: rekrutmen.targetKTA - rekrutmen.tercapaiKTA, fill: '#262626' }
                          ]}
                          innerRadius={45}
                          outerRadius={60}
                          dataKey="value"
                          stroke="none"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-black text-white">{ktaPercentage}%</span>
                    </div>
                  </div>
                  <div className="flex-1 pl-4">
                     <p className="text-sm text-neutral-400">Target 2026</p>
                     <p className="text-xl font-bold text-white mb-2">{rekrutmen.targetKTA.toLocaleString('id-ID')} <span className="text-sm text-neutral-500 font-normal">KTA</span></p>
                     <p className="text-sm text-neutral-400">Tercapai</p>
                     <p className="text-xl font-bold text-red-500">{rekrutmen.tercapaiKTA.toLocaleString('id-ID')} <span className="text-sm text-neutral-500 font-normal">KTA</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Top 3 Rekruter Minggu Ini</h4>
                  <div className="space-y-2">
                    {rekrutmen.topRelawan.map((r: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-black text-sm">#{i+1}</span>
                          <span className="text-sm text-neutral-300 font-medium">{r.name}</span>
                        </div>
                        <span className="text-xs font-bold bg-neutral-800 px-2 py-1 rounded text-white">{r.recruitments} KTA</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ringkasan Anggaran & Kegiatan */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign className="w-24 h-24" /></div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-300 mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                    Aktivitas & Anggaran
                  </h3>
                  <div className="space-y-6 z-10 relative">
                    <div>
                      <p className="text-xs text-neutral-500 font-bold uppercase mb-1">Total Kegiatan (Bulan Ini)</p>
                      <p className="text-4xl font-black text-white">{kegiatan.totalBulanIni}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-bold uppercase mb-1">Serapan Dana Operasional</p>
                      <p className="text-2xl font-black text-red-400">{kegiatan.serapanAnggaran}</p>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-bold text-neutral-400 mb-1">
                        <span>Realisasi Program</span>
                        <span className="text-white">{kegiatan.persentaseSerapan}%</span>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{width: `${kegiatan.persentaseSerapan}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="mt-6 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-bold text-white rounded-lg border border-neutral-700 transition-colors">
                  Lihat Buku Kas DPC
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl mt-6">
              <h3 className="text-lg font-bold text-neutral-300 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                Milestone Timeline (2026 - 2029)
              </h3>
              <div className="flex items-start overflow-x-auto pb-4 hide-scrollbar">
                {timeline.map((item: any, i: number) => {
                  const isCompleted = item.status === 'completed';
                  const isInProgress = item.status === 'in-progress';
                  return (
                    <div key={i} className="flex-1 min-w-[150px] relative px-2">
                      <div className="h-1 bg-neutral-800 w-full absolute top-2.5 left-0 -z-10">
                        {isCompleted && <div className="h-full bg-red-600 w-full"></div>}
                        {isInProgress && <div className="h-full bg-red-600 w-1/2"></div>}
                      </div>
                      <div className={`w-6 h-6 rounded-full mx-auto border-4 border-neutral-900 mb-3 flex items-center justify-center ${isCompleted ? 'bg-red-600' : (isInProgress ? 'bg-yellow-500 animate-pulse' : 'bg-neutral-700')}`}></div>
                      <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-wider ${isCompleted ? 'text-red-500' : 'text-neutral-500'}`}>{item.quarter}</p>
                        <p className={`text-xs mt-1 font-medium ${isCompleted || isInProgress ? 'text-white' : 'text-neutral-500'}`}>{item.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Widget 3: Live Feed Kejadian */}
          <div className="lg:col-span-3 xl:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
                  <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                  Laporan Wilayah
                </h3>
                <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/50 px-2 py-1 rounded border border-red-900/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div> Live
                </span>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {laporan.map((lap: any) => (
                  <div key={lap.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-neutral-500 uppercase">{lap.time}</span>
                      {lap.severity === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded mb-2 ${
                      lap.type === 'Intelijen' ? 'bg-purple-950 text-purple-400 border border-purple-900' : 
                      lap.type === 'Kegiatan' ? 'bg-blue-950 text-blue-400 border border-blue-900' :
                      'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}>
                      {lap.type}
                    </span>
                    <p className="text-sm text-neutral-300 leading-snug">{lap.text}</p>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-bold text-white rounded-lg border border-neutral-700 transition-colors">
                Lihat Semua Laporan
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
