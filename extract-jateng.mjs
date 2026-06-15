import fs from 'fs';
import pkg from 'geojson-indonesia';

const { getKotaJson } = pkg;
const allKota = getKotaJson();

const jateng = allKota.features.filter(f => {
  const p = f.properties;
  return p.NAME_1 && (p.NAME_1 === 'Jawa Tengah' || p.NAME_1 === 'JawaTengah');
});

if (jateng.length > 0) {
  fs.writeFileSync('./public/jateng.json', JSON.stringify({ type: "FeatureCollection", features: jateng }));
  console.log(`Saved ${jateng.length} regions to jateng.json`);
} else {
  console.log("Still not found. All provinces:", [...new Set(allKota.features.map(f => f.properties.NAME_1))].join(', '));
}
