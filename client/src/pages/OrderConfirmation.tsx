import { useLocation } from "wouter";
import { CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function OrderConfirmation() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const orderNumber = searchParams.get("number");
  const amount = searchParams.get("amount");
  const method = searchParams.get("method");
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiato", description: "Coordinate copiate negli appunti" });
  };

  if (!orderNumber) {
    return (
      <div className="container-padding py-24 text-center">
        <h1 className="text-3xl font-bold">Nessun ordine trovato</h1>
        <Link href="/" className="text-primary hover:underline mt-4 block">Torna alla Home</Link>
      </div>
    );
  }

  return (
    <div className="container-padding max-w-3xl mx-auto py-24 text-center">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="w-12 h-12" />
      </div>

      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Grazie per il tuo ordine!</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Il numero del tuo ordine è <span className="font-mono font-bold text-foreground bg-secondary px-2 py-1 rounded">{orderNumber}</span>
      </p>

      <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-xl mb-12 text-left">
        <h2 className="text-2xl font-bold mb-6 text-center">Istruzioni per il pagamento</h2>
        
        <p className="mb-6 text-center text-muted-foreground">
          Per completare l'ordine, effettua il pagamento di <span className="font-bold text-foreground text-lg">€ {amount}</span> utilizzando i dati seguenti:
        </p>

        {method === "bonifico" ? (
          <div className="space-y-4 bg-secondary/30 p-6 rounded-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">Beneficiario</span>
              <span className="font-bold">Cicli Volante</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border group cursor-pointer" onClick={() => handleCopy("IT52PO357601601010008072943")}>
              <span className="text-muted-foreground">IBAN</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">IT52 PO35 7601 6010 1000 8072 943</span>
                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground">Causale</span>
              <span className="font-bold">Ordine #{orderNumber}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-secondary/30 p-6 rounded-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">Beneficiario</span>
              <span className="font-bold">Cicli Volante</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border group cursor-pointer" onClick={() => handleCopy("IT52PO357601601010008072943")}>
              <span className="text-muted-foreground">IBAN</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">IT52 PO35 7601 6010 1000 8072 943</span>
                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground">Causale</span>
              <span className="font-bold">Ordine #{orderNumber}</span>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-center text-muted-foreground">
          La spedizione avverrà dopo la ricezione del pagamento. Spedizione sempre assicurata con BRT/SDA (24-48h).
          Invia la ricevuta a <span className="font-bold text-primary">pagamenti@ciclivolante.it</span> per accelerare la spedizione.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link href="/" className="btn-outline">Torna alla Home</Link>
        <Link href="/traccia" className="btn-primary">Traccia Ordine</Link>
      </div>
    </div>
  );
}
