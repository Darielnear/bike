import { useCart } from "@/hooks/use-cart";
import { Link, useLocation } from "wouter";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="container-padding max-w-7xl mx-auto py-24 text-center">
        <h1 className="font-display text-4xl font-bold mb-6">Il tuo carrello è vuoto</h1>
        <p className="text-muted-foreground mb-8">Non hai ancora aggiunto prodotti.</p>
        <Link href="/prodotti" className="btn-primary inline-block">
          Inizia lo Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-padding max-w-7xl mx-auto py-12 md:py-24">
      <h1 className="font-display text-4xl font-bold mb-12">Carrello ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-xl border border-border shadow-sm">
              <Link href={`/prodotto/${product.slug}`} className="w-full sm:w-32 aspect-square bg-secondary rounded-lg overflow-hidden shrink-0">
                <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/prodotto/${product.slug}`} className="font-bold text-lg hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                    <button 
                      onClick={() => removeItem(product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.category}</p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-border rounded h-10 w-28 px-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 hover:text-primary"><Minus className="w-3 h-3" /></button>
                    <span className="flex-1 text-center text-sm font-bold">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 hover:text-primary"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">{formatCurrency(Number(product.price) * quantity)}</p>
                    {quantity > 1 && (
                      <p className="text-xs text-muted-foreground">{formatCurrency(Number(product.price))} / cad</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg sticky top-24">
            <h2 className="font-display text-2xl font-bold mb-6">Riepilogo Ordine</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotale</span>
                <span>{formatCurrency(total())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Spedizione</span>
                <span className="text-primary font-medium">{total() > 500 ? 'Gratuita' : '€ 25,00'}</span>
              </div>
              <div className="border-t border-border pt-4 mt-4 flex justify-between text-xl font-bold text-foreground">
                <span>Totale</span>
                <span>{formatCurrency(total() > 500 ? total() : total() + 25)}</span>
              </div>
            </div>

            <button 
              onClick={() => setLocation("/checkout")}
              className="w-full btn-primary h-14 flex items-center justify-center gap-2"
            >
              Procedi al Checkout <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground text-center">
              <p>Pagamenti sicuri al 100%</p>
              <p>Spediamo in tutta Italia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
