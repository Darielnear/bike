import { Truck, RotateCcw, Package, Clock } from "lucide-react";

export default function Shipping() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-display font-bold mb-12 text-center uppercase tracking-tighter">Spedizioni e Resi</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Truck className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Spedizione Sicura</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Utilizziamo corrieri specializzati (BRT/SDA) per il trasporto di e-bike. Ogni spedizione è assicurata per l'intero valore del prodotto.
                Tempi di consegna: 3-5 giorni lavorativi in tutta Italia.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Tempi di Elaborazione</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Gli ordini vengono elaborati entro 24-48 ore dalla ricezione del pagamento tramite bonifico bancario.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <RotateCcw className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Reso Facile</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Hai 14 giorni di tempo per restituire il tuo acquisto se non sei soddisfatto. Il prodotto deve essere restituito nel suo imballaggio originale e non deve aver percorso più di 5km.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Package className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Costi di Spedizione</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Spedizione gratuita per ordini superiori a 500€. Per ordini inferiori, il costo è calcolato in base al peso e alla destinazione.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
