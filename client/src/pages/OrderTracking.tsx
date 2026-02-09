import { useState } from "react";
import { useOrder } from "@/hooks/use-orders";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Truck, CheckCircle, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function OrderTracking() {
  const [search, setSearch] = useState("");
  const [orderId, setOrderId] = useState("");
  
  const { data: order, isLoading, error } = useOrder(orderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setOrderId(search.trim());
  };

  const steps = [
    { status: "pending_payment", label: "In attesa di pagamento", icon: Loader2 },
    { status: "paid", label: "Pagamento Ricevuto", icon: CheckCircle },
    { status: "shipped", label: "Spedito", icon: Truck },
    { status: "delivered", label: "Consegnato", icon: Package },
  ];

  const currentStepIndex = order ? steps.findIndex(s => s.status === order.orderStatus) : -1;

  return (
    <div className="container-padding max-w-3xl mx-auto py-24 min-h-[60vh]">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-4">Traccia il tuo ordine</h1>
        <p className="text-muted-foreground">Inserisci il numero d'ordine ricevuto via email.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 max-w-md mx-auto mb-16">
        <Input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Es. ORD-1234-ABCD" 
          className="premium-input h-14"
        />
        <button type="submit" className="btn-primary px-8 h-14 flex items-center justify-center">
          <Search className="w-5 h-5" />
        </button>
      </form>

      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Ricerca ordine in corso...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-red-50 text-red-600 rounded-xl">
          <p className="font-bold">Ordine non trovato</p>
          <p className="text-sm">Controlla il numero e riprova.</p>
        </div>
      )}

      {order && (
        <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-foreground text-white p-6 flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Ordine</p>
              <p className="font-mono font-bold text-xl">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-70">Totale</p>
              <p className="font-bold text-xl">{formatCurrency(Number(order.totalAmount))}</p>
            </div>
          </div>

          <div className="p-8">
            {/* Progress Bar */}
            <div className="relative flex justify-between mb-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10 -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.max(0, currentStepIndex) / (steps.length - 1) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const Icon = step.icon;
                return (
                  <div key={step.status} className="flex flex-col items-center gap-2 bg-card px-2">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted-foreground'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold text-center w-24 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border">
              <div>
                <h3 className="font-bold mb-2">Spedizione a:</h3>
                <div className="text-muted-foreground">
                  <p className="font-medium text-foreground">{order.customerName}</p>
                  <p>{(order.shippingAddress as any).via}</p>
                  <p>{(order.shippingAddress as any).cap} {(order.shippingAddress as any).città} ({(order.shippingAddress as any).provincia})</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Stato Pagamento:</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {order.paymentStatus === 'pending' ? 'In Attesa' : 'Completato'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
