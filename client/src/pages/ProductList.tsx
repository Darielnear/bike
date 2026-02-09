import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useRoute, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ProductList() {
  const [match, params] = useRoute("/prodotti/:category?");
  const category = params?.category;
  
  const { data: products, isLoading, error } = useProducts({ category });

  const categories = [
    { name: "Tutte", value: undefined, label: "Tutte le Bici" },
    { name: "urbane", value: "urbane", label: "Urbane" },
    { name: "mountain", value: "mountain", label: "Mountain" },
    { name: "pieghevoli", value: "pieghevoli", label: "Pieghevoli" },
  ];

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold mb-2">Errore nel caricamento</h2>
      <p className="text-muted-foreground">Riprova più tardi.</p>
    </div>
  );

  return (
    <div className="container-padding max-w-7xl mx-auto py-12 md:py-24">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 capitalize">
          {category ? category : "La Collezione"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {category === 'urbane' && "Eleganti, veloci e pratiche. Perfette per la città."}
          {category === 'mountain' && "Potenza pura per conquistare ogni vetta."}
          {category === 'pieghevoli' && "Portala ovunque. La libertà in formato compatto."}
          {!category && "Scopri la nostra gamma completa di biciclette elettriche ad alte prestazioni."}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={cat.value ? `/prodotti/${cat.value}` : "/prodotti"}
          >
            <div className={cn(
              "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all cursor-pointer",
              (category === cat.value) 
                ? "bg-foreground text-white shadow-lg" 
                : "bg-white border border-border hover:border-primary text-muted-foreground hover:text-primary"
            )}>
              {cat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-secondary/30 rounded-xl">
          <p className="text-xl font-medium text-muted-foreground">Nessun prodotto trovato in questa categoria.</p>
        </div>
      )}
    </div>
  );
}
