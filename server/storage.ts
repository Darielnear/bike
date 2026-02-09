
import { db } from "./db";
import {
  products,
  orders,
  orderItems,
  reviews,
  adminUsers,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type AdminUser
} from "@shared/schema";
import { eq, like, desc } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(filters?: { category?: string; featured?: boolean; bestseller?: boolean }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrders(): Promise<Order[]>;
  getOrder(orderNumber: string): Promise<(Order & { items: OrderItem[] }) | undefined>;
  updateOrderStatus(id: number, status: { paymentStatus?: string; orderStatus?: string }): Promise<Order>;

  // Admin
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(filters?: { category?: string; featured?: boolean; bestseller?: boolean }): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (filters?.category) {
      query = query.where(eq(products.category, filters.category)) as any;
    }
    
    // Simple client-side filtering for booleans if needed, or add more where clauses
    // For now, let's just return all and filter in route or add specific where clauses
    const results = await query;
    return results.filter(p => {
      if (filters?.featured && !p.isFeatured) return false;
      if (filters?.bestseller && !p.isBestseller) return false;
      return true;
    });
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(orderNumber: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { ...order, items };
  }

  async updateOrderStatus(id: number, status: { paymentStatus?: string; orderStatus?: string }): Promise<Order> {
    const [updated] = await db.update(orders).set(status).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }
}

export const storage = new DatabaseStorage();
