import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search,
  Bike,
  Mountain,
  Map,
  Wrench
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductList({ params }: { params: { category?: string } }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.category ? decodeURIComponent(params.category) : null);
  
  const { data: products, isLoading } = useProducts();

  const categories = [
    { name: "E-MTB", icon: Mountain },
    { name: "E-City & Urban", icon: Bike },
    { name: "Trekking & Gravel", icon: Map },
    { name: "Accessori & Sicurezza", icon: Wrench }
  ];

  const filteredProducts = products?.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const itemsPerPage = 12;
  const totalPages = filteredProducts ? Math.ceil(filteredProducts.length / itemsPerPage) : 0;
  const currentProducts = filteredProducts?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  return (
    <div className="container-padding py-12 md:py-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">I Nostri Prodotti</h1>
          <p className="text-muted-foreground">Scegli la tua compagna di avventure ideale.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cerca modello..." 
              className="pl-10 premium-input" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={selectedCategory || "all"} onValueChange={(val) => handleCategoryChange(val === "all" ? null : val)}>
            <SelectTrigger className="w-full sm:w-64 premium-input">
              <SelectValue placeholder="Tutte le categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtra Categoria
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryChange(null)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${!selectedCategory ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-secondary'}`}
              >
                Tutti i Prodotti
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-secondary'}`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[450px] bg-secondary/20 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : currentProducts && currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-bold">Pagina {page} di {totalPages}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-secondary/10 rounded-2xl border border-dashed border-border">
              <p className="text-xl font-medium text-muted-foreground">Nessun prodotto trovato.</p>
              <Button variant="link" onClick={() => { setSelectedCategory(null); setSearch(""); }} className="mt-4">
                Resetta filtri
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
