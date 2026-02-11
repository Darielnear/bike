import { type InsertProduct } from "../shared/schema";

export function generate75Products(): InsertProduct[] {
  const categories = [
    { name: "E-MTB", range: [1, 15], motor: "Bosch Performance CX", battery: 750, desc: "Potenza e controllo per i sentieri più impegnativi." },
    { name: "E-City & Urban", range: [16, 35], motor: "Bosch Active Line", battery: 500, desc: "La soluzione perfetta per la mobilità urbana quotidiana." },
    { name: "Trekking & Gravel", range: [36, 50], motor: "Bosch Performance Speed", battery: 625, desc: "Versatilità totale dall'asfalto allo sterrato." },
    { name: "Accessori & Sicurezza", range: [51, 75], motor: "N/A", battery: 0, desc: "Accessori di alta qualità per la tua sicurezza." }
  ];

  const products: InsertProduct[] = [];

  categories.forEach(cat => {
    for (let i = cat.range[0]; i <= cat.range[1]; i++) {
      const isAccessory = cat.name === "Accessori & Sicurezza";
      products.push({
        name: `${cat.name} Modello ${i}`,
        slug: `${cat.name.toLowerCase().replace(/ /g, '-').replace('&', 'and')}-${i}`,
        category: cat.name,
        brand: "Cicli Volante",
        price: isAccessory ? (45 + i).toString() + ".00" : (2450 + i * 120).toString() + ".00",
        shortDescription: cat.desc,
        fullDescription: `Il modello ${i} della linea ${cat.name} rappresenta l'eccellenza del design italiano. Ogni dettaglio è studiato per offrire il massimo comfort e prestazioni superiori.`,
        descriptionDettagliata: isAccessory ? "Materiali premium resistenti, design ergonomico italiano per la massima sicurezza." : `Motore: ${cat.motor}\nBatteria: ${cat.battery}Wh\nTrasmissione: Shimano XT\nSicurezza: Quad Lock integrato\nDotazione: Telaio rinforzato, componenti certificati.`,
        autonomy: isAccessory ? 0 : 90 + (i % 30),
        motor: cat.motor,
        batteriaWh: cat.battery,
        mainImage: `/img/${i}.jpg`,
        stockQuantity: 12,
        isBestseller: i % 8 === 0,
        isFeatured: i <= 5
      });
    }
  });

  return products;
}
