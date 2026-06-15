export const generateMockData = (kabupatenName: string) => {
  const isBanjarnegara = kabupatenName.toUpperCase().includes('BANJARNEGARA');
  
  return {
    overview: {
      kader: isBanjarnegara ? 1450 : Math.floor(Math.random() * 2000) + 500,
      relawan: isBanjarnegara ? 3205 : Math.floor(Math.random() * 4000) + 1000,
      tpsCovered: isBanjarnegara ? 85 : Math.floor(Math.random() * 60) + 20,
      status: isBanjarnegara ? 'Online' : (Math.random() > 0.5 ? 'Online' : 'Offline'),
      lastSync: new Date().toLocaleTimeString()
    },
    
    // Perolehan Suara Partai (Simulasi)
    suaraPartai: [
      { name: 'PDIP', value: isBanjarnegara ? 35 : Math.floor(Math.random() * 20) + 15, color: '#dc2626' },
      { name: 'PKB', value: isBanjarnegara ? 20 : Math.floor(Math.random() * 15) + 10, color: '#16a34a' },
      { name: 'Gerindra', value: isBanjarnegara ? 18 : Math.floor(Math.random() * 15) + 10, color: '#ca8a04' },
      { name: 'Golkar', value: isBanjarnegara ? 15 : Math.floor(Math.random() * 15) + 5, color: '#eab308' },
      { name: 'Lainnya', value: 12, color: '#737373' },
    ],

    // Info Pengurus DPC
    pengurus: [
      { role: 'Ketua DPC', name: isBanjarnegara ? 'H. Nuryanto' : 'Budi Santoso', status: 'Aktif' },
      { role: 'Sekretaris', name: isBanjarnegara ? 'Ismawan S.' : 'Siti Aminah', status: 'Aktif' },
      { role: 'Bendahara', name: isBanjarnegara ? 'Sri Rahayu' : 'Agus Yulianto', status: 'Aktif' },
    ],

    // Gamifikasi KTA & Target
    rekrutmen: {
      targetKTA: isBanjarnegara ? 5000 : 3000,
      tercapaiKTA: isBanjarnegara ? 3205 : Math.floor(Math.random() * 3000),
      topRelawan: [
        { name: 'Agus (Korcam Susukan)', recruitments: 124 },
        { name: 'Wawan (Ranting Bawang)', recruitments: 98 },
        { name: 'Sari (PAC Punggelan)', recruitments: 76 }
      ]
    },

    // Timeline Strategis 2026-2029
    timeline: [
      { quarter: 'Q1 2026', title: 'Konsolidasi PAC se-Kabupaten', status: 'completed' },
      { quarter: 'Q2 2026', title: 'Pemetaan DPT & Zona Merah', status: 'completed' },
      { quarter: 'Q3 2026', title: 'Rekrutmen Relawan TPS Tahap 1', status: 'in-progress' },
      { quarter: 'Q1 2027', title: 'Pelatihan Saksi Nasional', status: 'pending' },
      { quarter: 'Q2 2028', title: 'Gelar Pasukan & Simulasi Pengamanan', status: 'pending' },
      { quarter: 'Q1 2029', title: 'Hari Pemungutan Suara', status: 'pending' },
    ],

    // Laporan & Peristiwa Wilayah
    laporan: [
      { id: 1, time: '10 Menit lalu', type: 'Intelijen', text: 'Pergerakan kampanye gelap di Desa Purwasaba terdeteksi oleh Relawan.', severity: 'high' },
      { id: 2, time: '2 Jam lalu', type: 'Kegiatan', text: 'Bazar Sembako Murah PAC Rakit berjalan lancar dihadiri 500 warga.', severity: 'low' },
      { id: 3, time: 'Kemarin', type: 'Logistik', text: 'Kekurangan 2.000 Kaos di posko Punggelan.', severity: 'medium' },
      { id: 4, time: 'Kemarin', type: 'KTA', text: 'Pencetakan KTA massal gelombang 3 selesai.', severity: 'low' },
    ],

    // Ringkasan Kegiatan
    kegiatan: {
      totalBulanIni: 45,
      serapanAnggaran: 'Rp 125.500.000',
      persentaseSerapan: 78
    }
  };
};
