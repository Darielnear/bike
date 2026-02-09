
import { z } from 'zod';
import { insertProductSchema, insertOrderSchema, insertReviewSchema, products, orders, reviews, adminUsers } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      input: z.object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
        bestseller: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:slug' as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: { // Admin only
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: { // Admin only
      method: 'PUT' as const,
      path: '/api/products/:id' as const,
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: { // Admin only
      method: 'DELETE' as const,
      path: '/api/products/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: z.object({
        order: insertOrderSchema,
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        }))
      }),
      responses: {
        201: z.object({
          orderNumber: z.string(),
          totalAmount: z.string(),
        }), // Returns minimal info for confirmation page
        400: errorSchemas.validation,
      },
    },
    list: { // Admin only
      method: 'GET' as const,
      path: '/api/orders' as const,
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:orderNumber' as const, // For tracking
      responses: {
        200: z.custom<typeof orders.$inferSelect & { items: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
    updateStatus: { // Admin only
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({
        paymentStatus: z.enum(['pending', 'completed', 'failed']).optional(),
        orderStatus: z.enum(['pending_payment', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
      }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  admin: {
    login: {
      method: 'POST' as const,
      path: '/api/admin/login' as const,
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof adminUsers.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/admin/logout' as const,
      responses: {
        200: z.void(),
      },
    },
    me: {
       method: 'GET' as const,
       path: '/api/admin/me' as const,
       responses: {
         200: z.custom<typeof adminUsers.$inferSelect>(),
         401: z.null(),
       }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
