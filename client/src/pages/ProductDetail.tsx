import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [match, params] = useRoute("/prodotto/:slug");
  const { data: product, isLoading } = useProduct(params?.slug || "");
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center">Prodotto non trovato</div>
  );

  const images = [product.mainImage, ...(product.galleryImages || [])];

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Aggiunto al carrello",
      description: `${quantity}x ${product.name} aggiunto con successo.`,
    });
  };

  return (
    <div className="container-padding max-w-7xl mx-auto py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/3] w-full bg-secondary/30 rounded-2xl overflow-hidden relative"
          >
            <img 
              src={images[activeImage]} 
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-sm font-bold tracking-widest text-primary uppercase">{product.category}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">{product.name}</h1>
          
          <div className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
            {formatCurrency(Number(product.price))}
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through font-normal">
                {formatCurrency(Number(product.originalPrice))}
              </span>
            )}
          </div>

          <div className="prose prose-lg text-muted-foreground mb-10 max-w-none">
            <p>{product.fullDescription || product.shortDescription}</p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10 border-y border-border py-8">
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground mb-1">{product.autonomy || 60}km</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Autonomia</span>
            </div>
            <div className="text-center border-l border-border px-4">
              <span className="block text-2xl font-bold text-foreground mb-1">{product.maxSpeed || 25}km/h</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Velocità Max</span>
            </div>
            <div className="text-center border-l border-border">
              <span className="block text-2xl font-bold text-foreground mb-1">{product.motor || "250W"}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Motore</span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center border border-border rounded h-14 w-full sm:w-32 px-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:text-primary transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 btn-primary h-14 flex items-center justify-center gap-2 text-base"
            >
              <ShoppingBag className="w-5 h-5" /> Aggiungi al Carrello
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-foreground" />
              <span>Spedizione gratuita in 24/48h</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-foreground" />
              <span>Garanzia ufficiale 2 anni</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-foreground" />
              <span>Batteria Long-Range inclusa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
