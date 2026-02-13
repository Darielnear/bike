import { ShieldCheck, Award, Clock, CheckCircle2 } from "lucide-react";

export default function Warranty() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Garanzia Premium</h1>
        <p className="text-muted-foreground mt-2">La tua tranquillità è la nostra priorità.</p>
      </div>

      <div className="space-y-8">
        <section className="p-8 bg-card border rounded-xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Copertura Estesa
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ogni e-bike Cicli Volante è coperta da una garanzia di 2 anni sui componenti elettrici e 5 anni sul telaio. 
            La nostra Garanzia Premium include anche il primo tagliando gratuito presso i nostri centri autorizzati.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <Award className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Qualità Certificata</h3>
            <p className="text-sm text-muted-foreground">Utilizziamo solo componenti dei migliori produttori mondiali per garantire affidabilità nel tempo.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Sostituzione Rapida</h3>
            <p className="text-sm text-muted-foreground">In caso di difetti di fabbrica, garantiamo la sostituzione delle parti danneggiate entro 7 giorni lavorativi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
