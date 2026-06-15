import fs from 'fs';

async function fetchJateng() {
  try {
    const urls = [
      "https://raw.githubusercontent.com/mahendrayudha/indonesia-geojson/master/kabupaten.geojson",
      "https://raw.githubusercontent.com/JfrAziz/indonesia-district/master/kabupaten.geojson"
    ];
    
    let data;
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          data = await res.json();
          break;
        }
      } catch (e) {}
    }
    
    if (!data) throw new Error("Could not fetch GeoJSON");
    
    // Filter for Central Java
    // Note: Property names vary (PROVINSI, Propinsi, state, etc)
    const jatengFeatures = data.features.filter(f => {
      const props = f.properties;
      return (
        props.PROVINSI === 'JAWA TENGAH' || 
        props.Propinsi === 'JAWA TENGAH' || 
        props.WADMPR === 'Jawa Tengah' ||
        props.state === 'Jawa Tengah' ||
        (props.NAME_1 && props.NAME_1.toUpperCase() === 'JAWA TENGAH')
      );
    });
    
    console.log(`Found ${jatengFeatures.length} regencies for Jawa Tengah`);
    
    const jatengGeojson = {
      type: "FeatureCollection",
      features: jatengFeatures
    };
    
    fs.writeFileSync('./public/jateng.json', JSON.stringify(jatengGeojson));
    console.log("Saved to public/jateng.json");
    
  } catch (e) {
    console.error(e);
  }
}
fetchJateng();
