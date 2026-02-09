import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addItem(product);
    toast({
      title: "Aggiunto al carrello",
      description: `${product.name} è stato aggiunto.`,
      duration: 3000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500"
    >
      <Link href={`/prodotto/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-secondary/30">
        {product.isBestseller && (
          <Badge className="absolute top-4 left-4 z-10 bg-primary hover:bg-primary text-white border-none shadow-lg">
            BESTSELLER
          </Badge>
        )}
        <img 
          src={product.mainImage} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center pb-6">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-white text-foreground hover:bg-primary hover:text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Aggiungi</span>
          </button>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">{product.category}</span>
          {product.stockQuantity && product.stockQuantity < 5 && (
            <span className="text-xs text-orange-500 font-medium">Solo {product.stockQuantity} rimasti</span>
          )}
        </div>
        
        <Link href={`/prodotto/${product.slug}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-display text-xl font-bold mb-2 leading-tight">{product.name}</h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
          {product.shortDescription}
        </p>
        
        <div className="flex items-end justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                {formatCurrency(Number(product.originalPrice))}
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(Number(product.price))}
            </span>
          </div>
          
          <Link 
            href={`/prodotto/${product.slug}`} 
            className="text-sm font-semibold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all duration-300"
          >
            Dettagli <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
