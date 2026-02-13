import { Card, CardContent } from "@/components/ui/sidebar";
import { Package, Truck, ShieldCheck, HelpCircle, LifeBuoy } from "lucide-react";

export default function SupportCenter() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold mb-8 text-center uppercase tracking-tighter">Centro Assistenza</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-4 mb-4">
            <LifeBuoy className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-bold">Supporto Tecnico</h2>
          </div>
          <p className="text-muted-foreground">Hai bisogno di aiuto con la tua e-bike? I nostri esperti sono a disposizione per assistenza tecnica via email o telefono.</p>
          <p className="mt-4 font-bold">Email: assistenza@ciclivolante.it</p>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-bold">Garanzia</h2>
          </div>
          <p className="text-muted-foreground">Tutte le nostre e-bike includono la Garanzia Premium Cicli Volante. Registra il tuo prodotto per attivare la copertura.</p>
        </div>
      </div>
    </div>
  );
}
