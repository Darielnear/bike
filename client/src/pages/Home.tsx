import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { ArrowRight, Battery, Bike, Wind } from "lucide-react";
import { motion } from "framer-motion";
import heroJpg from "@/assets/images/hero.jpg";
import urbanJpg from "@/assets/images/urban.jpg";
import accessoriesJpg from "@/assets/images/accessories.jpg";

export default function Home() {
  const { data: featuredProducts } = useProducts({ featured: true });
  const { data: bestsellers } = useProducts({ bestseller: true });

  return (
    <div className="flex flex-col gap-24 pb-24">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src={heroJpg} 
            alt="Hero E-Bike" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container-padding relative z-20 w-full max-w-7xl mx-auto text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
              Design Italiano
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1]">
              Scopri la <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Libertà</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-lg font-medium leading-relaxed drop-shadow-md">
              Esplora la città e la natura con la nostra nuova collezione di E-Bike premium. 
              Prestazioni eccezionali, stile inconfondibile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/prodotti" className="btn-primary text-center">
                Acquista Ora
              </Link>
              <Link href="/prodotti/E-City & Urban" className="px-6 py-3 rounded border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-center font-bold text-sm uppercase tracking-widest transition-all">
                Scopri Urban
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Finder Module */}
      <section className="container-padding -mt-12 relative z-30 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-border flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Altezza (cm)</label>
            <input 
              type="number" 
              placeholder="Es: 175" 
              className="w-full h-12 px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categoria</label>
            <select className="w-full h-12 px-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="E-MTB">E-MTB</option>
              <option value="E-City & Urban">E-City & Urban</option>
              <option value="Trekking & Gravel">Trekking & Gravel</option>
            </select>
          </div>
          <Link href="/prodotti" className="btn-primary h-12 px-8 flex-none w-full md:w-auto flex items-center justify-center">
            Trova e-bike
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container-padding max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Le Nostre Categorie</h2>
          <Link href="/prodotti" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
            Vedi tutte <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: 'E-MTB', 
              slug: 'E-MTB', 
              image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?q=80&w=1000&auto=format&fit=crop',
              desc: 'Performance & Montagna' 
            },
            { 
              name: 'E-City & Urban', 
              slug: 'E-City & Urban', 
              image: urbanJpg,
              desc: 'Città & Pieghevoli' 
            },
            { 
              name: 'Trekking & Gravel', 
              slug: 'Trekking & Gravel', 
              image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=1000&auto=format&fit=crop',
              desc: 'Avventura & Viaggi' 
            },
            { 
              name: 'Accessori', 
              slug: 'Accessori & Sicurezza', 
              image: accessoriesJpg,
              desc: 'Sicurezza & Manutenzione' 
            },
          ].map((cat) => (
            <Link key={cat.slug} href={`/prodotti/${cat.slug}`} className="group relative h-[400px] overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1000&auto=format&fit=crop";
                }}
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <h3 className="text-white text-3xl font-display font-bold mb-2">{cat.name}</h3>
                <p className="text-white/80 text-sm font-medium flex items-center justify-between">
                  {cat.desc}
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-foreground text-white py-24">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                <Battery className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Autonomia Garantita</h3>
              <p className="text-white/60 leading-relaxed">
                Le nostre batterie sono testate per garantire le massime prestazioni anche dopo anni di utilizzo intenso.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Design Italiano</h3>
              <p className="text-white/60 leading-relaxed">
                Ogni bicicletta è progettata in Italia con attenzione maniacale ai dettagli e all'estetica.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Assistenza Premium</h3>
              <p className="text-white/60 leading-relaxed">
                Supporto tecnico dedicato e garanzia di 2 anni su tutti i componenti meccanici ed elettrici.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Slider */}
      {bestsellers && bestsellers.length > 0 && (
        <section className="container-padding max-w-7xl mx-auto w-full">
           <div className="flex flex-col items-center text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3">Scelti dai Clienti</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold">I Più Venduti</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
