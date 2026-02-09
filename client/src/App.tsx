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
    <footer className="bg-foreground text-white/60 py-12 md:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="font-display text-2xl font-bold text-white tracking-tighter">
            CICLI<span className="text-primary italic">VOLANTE</span>
          </span>
          <p className="mt-4 text-sm leading-relaxed">
            Eccellenza italiana su due ruote. <br/>
            E-Bike progettate per la libertà.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Prodotti</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/prodotti/urbane" className="hover:text-primary transition-colors">Urbane</a></li>
            <li><a href="/prodotti/mountain" className="hover:text-primary transition-colors">Mountain</a></li>
            <li><a href="/prodotti/pieghevoli" className="hover:text-primary transition-colors">Pieghevoli</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Supporto</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/traccia" className="hover:text-primary transition-colors">Traccia Ordine</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Assistenza</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Garanzia</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Contatti</h4>
          <ul className="space-y-2 text-sm">
            <li>Milano, Via della Spiga 1</li>
            <li>info@ciclivolante.it</li>
            <li>+39 02 1234 5678</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p>© 2024 Cicli Volante S.r.l. P.IVA 12345678901</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/admin" className="hover:text-white transition-colors">Admin</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
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
