import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderTracking from "@/pages/OrderTracking";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

// Scroll to top on route change
function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs font-bold uppercase tracking-widest">
        Offerta Esclusiva: Spedizione Gratuita su tutti gli ordini sopra i 500€
      </div>
      <Switch>
        {/* Admin Route - No Navbar */}
        <Route path="/admin" component={Admin} />
        <Route path="/admin/login" component={Admin} />

        {/* Public Routes with Navbar */}
        <Route>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/prodotti" component={ProductList} />
                <Route path="/prodotti/:category" component={ProductList} />
                <Route path="/prodotto/:slug" component={ProductDetail} />
                <Route path="/carrello" component={Cart} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/conferma-ordine" component={OrderConfirmation} />
                <Route path="/traccia" component={OrderTracking} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </Route>
      </Switch>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white/60 py-16 md:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="font-display text-2xl font-bold text-white tracking-tighter">
            CICLI<span className="text-primary italic">VOLANTE</span>
          </span>
          <p className="mt-6 text-sm leading-relaxed max-w-xs">
            Eccellenza italiana su due ruote. Progettiamo e-bike premium per chi non accetta compromessi tra stile, potenza e libertà.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
              <span className="text-[10px]">IG</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
              <span className="text-[10px]">FB</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
              <span className="text-[10px]">YT</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Esplora</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/prodotti/urbane" className="hover:text-white transition-colors">E-Bike Urbane</a></li>
            <li><a href="/prodotti/mountain" className="hover:text-white transition-colors">E-Bike Mountain</a></li>
            <li><a href="/prodotti/pieghevoli" className="hover:text-white transition-colors">E-Bike Pieghevoli</a></li>
            <li><a href="/prodotti" className="hover:text-white transition-colors">Tutti i Modelli</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Servizi e Supporto</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/traccia" className="hover:text-white transition-colors">Traccia il tuo Ordine</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Centro Assistenza</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Garanzia Premium</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Spedizioni e Resi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Rimani Aggiornato</h4>
          <p className="text-sm mb-4">Iscriviti per ricevere offerte esclusive e novità dal mondo Cicli Volante.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs w-full focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold hover:opacity-90 transition-opacity">
              OK
            </button>
          </div>
          <div className="mt-8">
            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-[10px]">Pagamenti Sicuri</h4>
            <div className="flex gap-3 opacity-50">
              <div className="px-2 py-1 border border-white/20 rounded text-[9px] font-bold">BONIFICO</div>
              <div className="px-2 py-1 border border-white/20 rounded text-[9px] font-bold">POSTEPAY</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-[10px] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center opacity-70">
          <p>© 2024 Cicli Volante S.r.l. • P.IVA 12345678901</p>
          <a href="/admin" className="hover:text-white transition-colors">Accesso Rivenditori</a>
        </div>
        <div className="flex gap-6 opacity-70">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-white transition-colors">Termini e Condizioni</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
