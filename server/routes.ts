
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { products } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === AUTH SETUP ===
  app.use(session({
    secret: process.env.SESSION_SECRET || "ebike_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getAdminUser(username);
      // In a real app, use bcrypt.compare here. For demo, simple string match if user is seeded simply.
      // But we will seed with plain text for simplicity in this MVP unless I add bcrypt.
      if (!user) return done(null, false);
      if (user.password !== password) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getAdminUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  // === API ROUTES ===

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts(req.query as any);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json(err);
      throw err;
    }
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const { order, items } = req.body;
      
      // Generate Order Number
      const orderNumber = `ORD${new Date().getFullYear()}${new Date().getMonth() + 1}${Math.floor(Math.random() * 10000)}`;
      
      const newOrder = await storage.createOrder({ ...order, orderNumber });
      
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
           await storage.createOrderItem({
             orderId: newOrder.id,
             productId: product.id,
             productName: product.name,
             productPrice: product.price,
             quantity: item.quantity,
             subtotal: (Number(product.price) * item.quantity).toString(),
           });
        }
      }
      
      res.status(201).json({
        orderNumber: newOrder.orderNumber,
        totalAmount: newOrder.totalAmount
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(req.params.orderNumber);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });
  
  app.get(api.orders.list.path, isAuthenticated, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.patch(api.orders.updateStatus.path, isAuthenticated, async (req, res) => {
    const order = await storage.updateOrderStatus(Number(req.params.id), req.body);
    res.json(order);
  });

  // Admin Auth
  app.post(api.admin.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.admin.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.admin.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json(null);
    }
  });

  return httpServer;
}

// Seed function
import { db } from "./db";
import { adminUsers } from "@shared/schema";

async function seed() {
  // Check if admin exists
  const admin = await storage.getAdminUser("admin");
  if (!admin) {
    await db.insert(adminUsers).values({
      username: "admin",
      password: "password123", // Plaintext for demo/lite build
      role: "admin"
    });
    console.log("Admin user created");
  }

  // Seed Products if empty
  const productsList = await storage.getProducts();
  if (productsList.length === 0) {
    const rawData = [
      {"id": 1, "categoria": "E-MTB", "marca": "Specialized", "modello": "Turbo Levo Gen 3", "motore": "Brose S Mag 90Nm", "batteria_wh": 700, "prezzo": 5800, "peso_kg": 22.5},
      {"id": 2, "categoria": "E-MTB", "marca": "Specialized", "modello": "Turbo Kenevo Expert", "motore": "Brose S Mag 90Nm", "batteria_wh": 700, "prezzo": 6200, "peso_kg": 24.5},
      {"id": 3, "categoria": "E-MTB", "marca": "Specialized", "modello": "Turbo Levo SL", "motore": "Specialized SL 1.1", "batteria_wh": 320, "prezzo": 6500, "peso_kg": 18.0},
      {"id": 4, "categoria": "E-MTB", "marca": "Orbea", "modello": "Wild FS X10", "motore": "Bosch CX Gen 4", "batteria_wh": 625, "prezzo": 5400, "peso_kg": 23.0},
      {"id": 5, "categoria": "E-MTB", "marca": "Orbea", "modello": "Rise M10", "motore": "Shimano EP8-RS", "batteria_wh": 360, "prezzo": 7200, "peso_kg": 18.5},
      {"id": 6, "categoria": "E-MTB", "marca": "Scott", "modello": "Patron eRIDE", "motore": "Bosch CX 85Nm", "batteria_wh": 750, "prezzo": 6900, "peso_kg": 24.0},
      {"id": 7, "categoria": "E-MTB", "marca": "Scott", "modello": "Spark eRIDE RC", "motore": "Shimano EP8", "batteria_wh": 500, "prezzo": 5900, "peso_kg": 21.5},
      {"id": 8, "categoria": "E-MTB", "marca": "Trek", "modello": "Rail 9.8", "motore": "Bosch CX Gen 4", "batteria_wh": 750, "prezzo": 8500, "peso_kg": 23.8},
      {"id": 9, "categoria": "E-MTB", "marca": "Trek", "modello": "Fuel EXe", "motore": "TQ-HPR50 50Nm", "batteria_wh": 360, "prezzo": 7900, "peso_kg": 19.2},
      {"id": 10, "categoria": "E-MTB", "marca": "Canyon", "modello": "Spectral:ON CF8", "motore": "Shimano EP8", "batteria_wh": 720, "prezzo": 5200, "peso_kg": 23.1},
      {"id": 11, "categoria": "E-MTB", "marca": "Canyon", "modello": "Strive:ON CFR", "motore": "Bosch CX Race", "batteria_wh": 625, "prezzo": 6800, "peso_kg": 22.8},
      {"id": 12, "categoria": "E-MTB", "marca": "Haibike", "modello": "AllMtn 7", "motore": "Yamama PW-X3", "batteria_wh": 720, "prezzo": 5600, "peso_kg": 24.5},
      {"id": 13, "categoria": "E-MTB", "marca": "Haibike", "modello": "Nduro 8 Freeride", "motore": "Yamaha PW-X3", "batteria_wh": 720, "prezzo": 6400, "peso_kg": 25.0},
      {"id": 14, "categoria": "E-MTB", "marca": "Cube", "modello": "Stereo Hybrid 160", "motore": "Bosch CX 85Nm", "batteria_wh": 750, "prezzo": 4900, "peso_kg": 24.2},
      {"id": 15, "categoria": "E-MTB", "marca": "Cannondale", "modello": "Moterra Neo 3", "motore": "Bosch CX 85Nm", "batteria_wh": 750, "prezzo": 5300, "peso_kg": 24.8},
      {"id": 16, "categoria": "E-City & Urban", "marca": "Cannondale", "modello": "Adventure Neo 3", "motore": "Bosch Active Line", "batteria_wh": 400, "prezzo": 2600, "peso_kg": 21.0},
      {"id": 17, "categoria": "E-City & Urban", "marca": "Specialized", "modello": "Turbo Vado 4.0", "motore": "Spec. 2.0 70Nm", "batteria_wh": 710, "prezzo": 3800, "peso_kg": 23.5},
      {"id": 18, "categoria": "E-City & Urban", "marca": "Specialized", "modello": "Turbo Vado SL 4.0", "motore": "Spec. SL 1.1", "batteria_wh": 320, "prezzo": 3200, "peso_kg": 15.0},
      {"id": 19, "categoria": "E-City & Urban", "marca": "Gazelle", "modello": "Ultimate C380 HMB", "motore": "Bosch Perf. Line", "batteria_wh": 500, "prezzo": 3900, "peso_kg": 24.8},
      {"id": 20, "categoria": "E-City & Urban", "marca": "Gazelle", "modello": "HeavyDutyNL", "motore": "Bosch Active Plus", "batteria_wh": 400, "prezzo": 2800, "peso_kg": 25.5},
      {"id": 21, "categoria": "E-City & Urban", "marca": "Gazelle", "modello": "Medeo T10 HMB", "motore": "Bosch Performance", "batteria_wh": 500, "prezzo": 3100, "peso_kg": 22.0},
      {"id": 22, "categoria": "E-City & Urban", "marca": "Riese & Müller", "modello": "Roadster Mixte", "motore": "Bosch Perf. Line", "batteria_wh": 625, "prezzo": 4600, "peso_kg": 23.5},
      {"id": 23, "categoria": "E-City & Urban", "marca": "Urban", "modello": "Urban 3 S", "motore": "Bafang 250W", "batteria_wh": 360, "prezzo": 2100, "peso_kg": 18.0},
      {"id": 24, "categoria": "E-City & Urban", "marca": "Kalkhoff", "modello": "Agrio 5.0", "motore": "Bosch Performance", "batteria_wh": 625, "prezzo": 3500, "peso_kg": 24.2},
      {"id": 25, "categoria": "E-City & Urban", "marca": "Winora", "modello": "Tourist 7", "motore": "Bosch Active", "batteria_wh": 400, "prezzo": 2400, "peso_kg": 23.0},
      {"id": 28, "categoria": "E-City & Urban", "marca": "Brompton", "modello": "Electric P Line (Pieghevole)", "motore": "Brompton 250W", "batteria_wh": 300, "prezzo": 4200, "peso_kg": 15.6},
      {"id": 29, "categoria": "E-City & Urban", "marca": "Nilox", "modello": "J5 Plus", "motore": "Bafang 250W", "batteria_wh": 320, "prezzo": 900, "peso_kg": 22.0},
      {"id": 30, "categoria": "E-City & Urban", "marca": "Decathlon", "modello": "Btwin E-FOLD 500", "motore": "Vision 250W", "batteria_wh": 252, "prezzo": 850, "peso_kg": 21.4},
      {"id": 31, "categoria": "E-City & Urban", "marca": "Tern", "modello": "Vektron Q9", "motore": "Bosch Active Plus", "batteria_wh": 400, "prezzo": 3600, "peso_kg": 21.9},
      {"id": 32, "categoria": "Trekking & Gravel", "marca": "Cube", "modello": "Kathmandu Hybrid", "motore": "Bosch CX 85Nm", "batteria_wh": 750, "prezzo": 3900, "peso_kg": 25.8},
      {"id": 33, "categoria": "Trekking & Gravel", "marca": "Cube", "modello": "Touring Hybrid Perf", "motore": "Bosch Performance", "batteria_wh": 625, "prezzo": 3200, "peso_kg": 24.5},
      {"id": 40, "categoria": "Trekking & Gravel", "marca": "Giant", "modello": "Explore E+ Pro", "motore": "SyncDrive Pro 80Nm", "batteria_wh": 625, "prezzo": 3500, "peso_kg": 23.5},
      {"id": 45, "categoria": "Trekking & Gravel", "marca": "Specialized", "modello": "Turbo Creo SL 2 (Gravel)", "motore": "Spec. SL 1.2", "batteria_wh": 320, "prezzo": 8500, "peso_kg": 13.5},
      {"id": 48, "categoria": "Trekking & Gravel", "marca": "BMC", "modello": "URS AMP LT (Gravel)", "motore": "TQ-HPR50", "batteria_wh": 360, "prezzo": 9000, "peso_kg": 14.2},
      {"id": 50, "categoria": "Trekking & Gravel", "marca": "Ridley", "modello": "E-Kanzo", "motore": "Fazua Evation", "batteria_wh": 250, "prezzo": 4500, "peso_kg": 15.0},
      {"id": 51, "categoria": "Accessori & Sicurezza", "marca": "Abus", "modello": "Bordo 6500 (Antifurto)", "motore": null, "batteria_wh": null, "prezzo": 140, "peso_kg": 1.5},
      {"id": 52, "categoria": "Accessori & Sicurezza", "marca": "Abus", "modello": "Granit X-Plus 540", "motore": null, "batteria_wh": null, "prezzo": 110, "peso_kg": 1.7},
      {"id": 53, "categoria": "Accessori & Sicurezza", "marca": "Kryptonite", "modello": "Evolution 4", "motore": null, "batteria_wh": null, "prezzo": 95, "peso_kg": 1.8},
      {"id": 58, "categoria": "Accessori & Sicurezza", "marca": "Giro", "modello": "Syntax MIPS (Casco)", "motore": null, "batteria_wh": null, "prezzo": 120, "peso_kg": 0.3},
      {"id": 59, "categoria": "Accessori & Sicurezza", "marca": "Abus", "modello": "UD-Neutral (Casco)", "motore": null, "batteria_wh": null, "prezzo": 85, "peso_kg": 0.4},
      {"id": 66, "categoria": "Accessori & Sicurezza", "marca": "Ortlieb", "modello": "Back-Roller Classic", "motore": null, "batteria_wh": null, "prezzo": 150, "peso_kg": 1.9},
      {"id": 73, "categoria": "Accessori & Sicurezza", "marca": "Muc-Off", "modello": "Kit Pulizia Completo", "motore": null, "batteria_wh": null, "prezzo": 65, "peso_kg": 1.0}
    ];

    // Create 75 products total
    const categories = ["E-MTB", "E-City & Urban", "Trekking & Gravel", "Accessori & Sicurezza"];
    const allProducts = [...rawData];
    const existingIds = new Set(rawData.map(p => p.id));
    
    for (let i = 1; i <= 75; i++) {
      if (!existingIds.has(i)) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        allProducts.push({
          id: i,
          categoria: cat,
          marca: "Generic",
          modello: `Modello ${i}`,
          motore: cat === "Accessori & Sicurezza" ? null : "Generic Motor",
          batteria_wh: cat === "Accessori & Sicurezza" ? null : 500,
          prezzo: cat === "Accessori & Sicurezza" ? 50 : 2500,
          peso_kg: cat === "Accessori & Sicurezza" ? 1 : 22
        });
      }
    }

    for (const p of allProducts) {
      const slug = `${p.modello.toLowerCase().replace(/ /g, '-')}-${p.id}`;
      await storage.createProduct({
        name: `${p.marca} ${p.modello}`,
        slug: slug,
        category: p.categoria,
        brand: p.marca,
        price: p.prezzo.toString(),
        motor: p.motore,
        batteriaWh: p.batteria_wh,
        weight: p.peso_kg.toString(),
        shortDescription: `Esperienza premium con ${p.marca} ${p.modello}. Innovazione e stile in ogni dettaglio.`,
        mainImage: `https://placehold.co/600x400?text=${p.marca}+${p.modello}`,
        stockQuantity: 10,
        isFeatured: p.id <= 6
      });
    }
    console.log("75 products seeded");
  }
}

seed().catch(console.error);
