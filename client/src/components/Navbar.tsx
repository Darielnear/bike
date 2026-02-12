import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Menu, ShoppingBag, X, Phone, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemsCount = useCart(state => state.items.length);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar - Trust Signals */}
      <div className="bg-foreground text-white py-2 px-4 text-xs font-medium tracking-wide hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> Spedizione Gratuita sopra i 500€</span>
            <span className="flex items-center gap-2 text-primary"><Phone className="w-3 h-3" /> Assistenza Clienti: +39 02 1234 5678</span>
          </div>
          <Link href="/traccia" className="hover:text-primary transition-colors cursor-pointer">Traccia il tuo ordine</Link>
        </div>
      </div>

      <nav className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-border py-2" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 z-50">
              <span className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
                CICLI<span className="text-primary italic">VOLANTE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/prodotti" className="text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors">Tutte le Bici</Link>
              <Link href="/prodotti/E-MTB" className="text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors">E-MTB</Link>
              <Link href="/prodotti/E-City & Urban" className="text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors">E-City & Urban</Link>
              <Link href="/prodotti/Trekking & Gravel" className="text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors">Trekking & Gravel</Link>
              <Link href="/prodotti/Accessori & Sicurezza" className="text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors">Accessori</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 z-50">
              <Link href="/carrello" className="relative p-2 hover:bg-secondary rounded-full transition-colors group">
                <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-32 px-6 md:hidden flex flex-col gap-6"
          >
            <Link href="/prodotti" className="text-2xl font-display font-medium border-b border-border pb-4">Tutte le Bici</Link>
            <Link href="/prodotti/E-MTB" className="text-2xl font-display font-medium border-b border-border pb-4">E-MTB</Link>
            <Link href="/prodotti/E-City & Urban" className="text-2xl font-display font-medium border-b border-border pb-4">E-City & Urban</Link>
            <Link href="/prodotti/Trekking & Gravel" className="text-2xl font-display font-medium border-b border-border pb-4">Trekking & Gravel</Link>
            <Link href="/prodotti/Accessori & Sicurezza" className="text-2xl font-display font-medium border-b border-border pb-4">Accessori</Link>
            <Link href="/traccia" className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-4">Traccia Ordine</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
