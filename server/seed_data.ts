import { type InsertProduct } from "../shared/schema";

const realBikeDetails = [
  { name: "Specialized Turbo Levo Pro", motor: "Bosch Performance Line CX", battery: 700, desc: "La regina delle mountain bike elettriche, potenza senza compromessi per i sentieri più impegnativi." },
  { name: "Orbea Wild FS M-Team", motor: "Bosch Performance CX", battery: 625, desc: "Una macchina da enduro progettata per dominare ogni discesa con agilità e forza." },
  { name: "Cannondale Adventure Neo 3", motor: "Bosch Active Line Plus", battery: 400, desc: "Perfetta per gli spostamenti urbani quotidiani con il massimo comfort e stile." },
  { name: "Trek Rail 9.8", motor: "Bosch Performance CX", battery: 750, desc: "Progettata per affrontare i terreni più accidentati con facilità estrema." },
  { name: "Specialized Turbo Vado 4.0", motor: "Specialized 2.0 (70Nm)", battery: 710, desc: "La bici perfetta per la vita in città, fluida, silenziosa e incredibilmente potente." },
  { name: "Riese & Müller Supercharger", motor: "Bosch Performance Speed", battery: 1000, desc: "Autonomia infinita e tecnologia tedesca per i lunghi viaggi senza limiti." },
  { name: "Cube Kathmandu Hybrid", motor: "Bosch Performance CX", battery: 750, desc: "Versatilità pura per il trekking, dalle strade cittadine ai sentieri sterrati." },
  { name: "Scott Patron eRIDE", motor: "Bosch Performance CX", battery: 750, desc: "Integrazione perfetta e geometria avanzata per un controllo totale." },
  { name: "Brompton Electric P Line", motor: "Brompton 250W", battery: 300, desc: "La leggendaria bici pieghevole, ora potenziata per muoversi agilmente nel traffico." },
  { name: "Gazelle Ultimate C380", motor: "Bosch Performance Line", battery: 500, desc: "Eleganza olandese unita alla trasmissione a variazione continua Enviolo." },
  { name: "Kalkhoff Agattu 3.B", motor: "Bosch Active Line", battery: 500, desc: "Stabilità e affidabilità per chi cerca una guida sicura e confortevole." },
  { name: "Bianchi T-Tronik Rebel", motor: "Bianchi Motor 85Nm", battery: 630, desc: "Il mito Bianchi incontra l'elettrico in una MTB pronta a tutto." },
  { name: "Haibike AllMtn 7", motor: "Yamaha PW-X3", battery: 720, desc: "Potenza giapponese e design tedesco per prestazioni off-road assolute." },
  { name: "Giant Explore E+", motor: "SyncDrive Pro", battery: 625, desc: "Scopri nuovi orizzonti con questa e-bike da trekking versatile e robusta." },
  { name: "Moustache Samedi 27", motor: "Bosch Performance Line", battery: 625, desc: "Il sorriso ai piedi del castello, una guida naturale e intuitiva." }
];

export function generate75Products(): InsertProduct[] {
  const categories = [
    { name: "E-MTB", range: [1, 15], motor: "Bosch Performance CX", battery: 750 },
    { name: "E-City & Urban", range: [16, 35], motor: "Bosch Active Line", battery: 500 },
    { name: "Trekking & Gravel", range: [36, 50], motor: "Bosch Performance Speed", battery: 625 },
    { name: "Accessori & Sicurezza", range: [51, 75], motor: "N/A", battery: 0 }
  ];

  const products: InsertProduct[] = [];

  categories.forEach(cat => {
    for (let i = cat.range[0]; i <= cat.range[1]; i++) {
      const isAccessory = cat.name === "Accessori & Sicurezza";
      const detailIndex = (i - 1) % realBikeDetails.length;
      const detail = realBikeDetails[detailIndex];
      
      const productName = isAccessory ? `Accessorio ${i}` : `${detail.name} Modello ${i}`;
      
      products.push({
        name: productName,
        slug: `${productName.toLowerCase().replace(/ /g, '-').replace('&', 'and')}-${i}`,
        category: cat.name,
        brand: isAccessory ? "Cicli Volante" : detail.name.split(' ')[0],
        price: isAccessory ? (45 + i).toString() + ".00" : (2450 + i * 120).toString() + ".00",
        shortDescription: isAccessory ? "Accessorio di alta qualità per la tua sicurezza e manutenzione." : detail.desc,
        fullDescription: isAccessory 
          ? `Questo accessorio premium è stato selezionato da Cicli Volante per garantire la massima affidabilità ai nostri clienti. Realizzato con materiali resistenti e design italiano.` 
          : `Il modello ${i} della serie ${detail.name} rappresenta il top della gamma ${cat.name}. Dotato di tecnologia all'avanguardia Bosch e trasmissione Shimano XT per un'esperienza di guida senza pari.`,
        descriptionDettagliata: isAccessory 
          ? "Materiali: Acciaio temperato / Polimeri alta densità\nSicurezza: Certificazione Quad Lock\nDesign: Ergonomico professionale" 
          : `Motore: ${cat.motor}\nBatteria: ${cat.battery}Wh\nTrasmissione: Shimano XT Shadow Plus\nSicurezza: Quad Lock integrato\nTelaio: Alluminio aeronautico / Carbonio`,
        autonomy: isAccessory ? 0 : 90 + (i % 30),
        motor: isAccessory ? "N/A" : cat.motor,
        batteriaWh: isAccessory ? 0 : cat.battery,
        mainImage: `/img/${i}.jpg`, // Correct relative path for static serving
        stockQuantity: 12,
        isBestseller: i % 8 === 0,
        isFeatured: i <= 5
      });
    }
  });

  return products;
}
