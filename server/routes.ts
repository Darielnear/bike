
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
    await storage.createProduct({
      name: "Urban Cruiser X1",
      slug: "urban-cruiser-x1",
      category: "urbane",
      price: "1299.00",
      description: "Perfetta per la città, autonomia estesa e comfort superiore.",
      mainImage: "https://placehold.co/600x400?text=Urban+Cruiser",
      autonomy: 80,
      motor: "250W Brushless",
      stockQuantity: 10,
      isFeatured: true
    } as any);

    await storage.createProduct({
      name: "Mountain King Pro",
      slug: "mountain-king-pro",
      category: "mountain",
      price: "2499.00",
      description: "Domina ogni sentiero con la potenza del motore centrale.",
      mainImage: "https://placehold.co/600x400?text=Mountain+King",
      autonomy: 60,
      motor: "500W Mid-Drive",
      stockQuantity: 5,
      isBestseller: true
    } as any);
    
    await storage.createProduct({
      name: "FoldGo Compact",
      slug: "foldgo-compact",
      category: "pieghevoli",
      price: "899.00",
      description: "Leggera, pieghevole e pronta per il viaggio.",
      mainImage: "https://placehold.co/600x400?text=FoldGo",
      autonomy: 40,
      motor: "250W Rear Hub",
      stockQuantity: 20
    } as any);
  }
}

seed().catch(console.error);
