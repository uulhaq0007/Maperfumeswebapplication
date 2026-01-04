import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Hash password (simple for demo - use bcrypt in production)
const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Verify admin token
const verifyAdmin = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken || accessToken === 'null') {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return null;
  }
  
  // Check if user is admin
  const adminData = await kv.get(`admin:${user.id}`);
  if (!adminData) {
    return null;
  }
  
  return user;
};

// ============================================
// ADMIN AUTH ENDPOINTS
// ============================================

// Admin signup (create admin account)
app.post("/make-server-ee87e1bb/admin/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create admin user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true, // Auto-confirm email since email server hasn't been configured
    });

    if (error) {
      console.log('Admin signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store admin flag in kv store
    await kv.set(`admin:${data.user.id}`, {
      email,
      name,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    return c.json({
      message: 'Admin account created successfully',
      user: { id: data.user.id, email, name },
    });
  } catch (error) {
    console.log('Admin signup error:', error);
    return c.json({ error: 'Failed to create admin account' }, 500);
  }
});

// Admin login (handled by Supabase client-side)
// This endpoint is for verification only
app.get("/make-server-ee87e1bb/admin/verify", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const adminData = await kv.get(`admin:${user.id}`);
    
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: adminData?.name || user.user_metadata?.name,
      },
    });
  } catch (error) {
    console.log('Admin verification error:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// ============================================
// PRODUCT ENDPOINTS
// ============================================

// Get all products
app.get("/make-server-ee87e1bb/products", async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    
    // Filter out inactive products for non-admin users
    const isAdmin = await verifyAdmin(c.req.raw);
    const filteredProducts = isAdmin 
      ? products 
      : products.filter(p => p.status === 'active');
    
    return c.json({ products: filteredProducts });
  } catch (error) {
    console.log('Get products error:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get single product
app.get("/make-server-ee87e1bb/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.log('Get product error:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Create product (admin only)
app.post("/make-server-ee87e1bb/products", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const productData = await c.req.json();
    const id = generateId();
    
    const product = {
      id,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: productData.status || 'active',
    };
    
    await kv.set(`product:${id}`, product);
    
    return c.json({ product });
  } catch (error) {
    console.log('Create product error:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product (admin only)
app.put("/make-server-ee87e1bb/products/:id", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`product:${id}`);
    if (!existing) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    const product = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`product:${id}`, product);
    
    return c.json({ product });
  } catch (error) {
    console.log('Update product error:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product (admin only)
app.delete("/make-server-ee87e1bb/products/:id", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const id = c.req.param('id');
    await kv.del(`product:${id}`);
    
    return c.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log('Delete product error:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ============================================
// ORDER ENDPOINTS
// ============================================

// Create order (guest checkout)
app.post("/make-server-ee87e1bb/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const id = generateId();
    
    // Generate a simple order number
    const orderNumber = `MA${Date.now().toString().slice(-8)}`;
    
    const order = {
      id,
      orderNumber,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`order:${id}`, order);
    await kv.set(`orderByNumber:${orderNumber}`, order);
    
    return c.json({ order });
  } catch (error) {
    console.log('Create order error:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get all orders (admin only)
app.get("/make-server-ee87e1bb/orders", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const orders = await kv.getByPrefix('order:');
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ orders });
  } catch (error) {
    console.log('Get orders error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Track order (public - requires order number and phone)
app.post("/make-server-ee87e1bb/orders/track", async (c) => {
  try {
    const { orderNumber, phone } = await c.req.json();
    
    if (!orderNumber || !phone) {
      return c.json({ error: 'Order number and phone are required' }, 400);
    }
    
    const order = await kv.get(`orderByNumber:${orderNumber}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    // Verify phone number matches
    if (order.phone !== phone) {
      return c.json({ error: 'Invalid phone number for this order' }, 403);
    }
    
    return c.json({ order });
  } catch (error) {
    console.log('Track order error:', error);
    return c.json({ error: 'Failed to track order' }, 500);
  }
});

// Update order status (admin only)
app.put("/make-server-ee87e1bb/orders/:id", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`order:${id}`);
    if (!existing) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    const order = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`order:${id}`, order);
    await kv.set(`orderByNumber:${order.orderNumber}`, order);
    
    return c.json({ order });
  } catch (error) {
    console.log('Update order error:', error);
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// ============================================
// COMPLAINT ENDPOINTS
// ============================================

// Submit complaint (public)
app.post("/make-server-ee87e1bb/complaints", async (c) => {
  try {
    const complaintData = await c.req.json();
    const id = generateId();
    
    const complaint = {
      id,
      ...complaintData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`complaint:${id}`, complaint);
    
    return c.json({ complaint });
  } catch (error) {
    console.log('Submit complaint error:', error);
    return c.json({ error: 'Failed to submit complaint' }, 500);
  }
});

// Get all complaints (admin only)
app.get("/make-server-ee87e1bb/complaints", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const complaints = await kv.getByPrefix('complaint:');
    
    // Sort by creation date (newest first)
    complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ complaints });
  } catch (error) {
    console.log('Get complaints error:', error);
    return c.json({ error: 'Failed to fetch complaints' }, 500);
  }
});

// Update complaint status (admin only)
app.put("/make-server-ee87e1bb/complaints/:id", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`complaint:${id}`);
    if (!existing) {
      return c.json({ error: 'Complaint not found' }, 404);
    }
    
    const complaint = {
      ...existing,
      ...updates,
      id,
    };
    
    await kv.set(`complaint:${id}`, complaint);
    
    return c.json({ complaint });
  } catch (error) {
    console.log('Update complaint error:', error);
    return c.json({ error: 'Failed to update complaint' }, 500);
  }
});

// ============================================
// SETTINGS ENDPOINTS
// ============================================

// Get settings (public)
app.get("/make-server-ee87e1bb/settings", async (c) => {
  try {
    let settings = await kv.get('settings:config');
    
    if (!settings) {
      // Default settings
      settings = {
        deliveryCharge: 200,
        currency: 'PKR',
        deliveryDays: '3-5 business days',
      };
      await kv.set('settings:config', settings);
    }
    
    return c.json({ settings });
  } catch (error) {
    console.log('Get settings error:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update settings (admin only)
app.put("/make-server-ee87e1bb/settings", async (c) => {
  try {
    const user = await verifyAdmin(c.req.raw);
    if (!user) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    const updates = await c.req.json();
    
    const existing = await kv.get('settings:config') || {};
    
    const settings = {
      ...existing,
      ...updates,
    };
    
    await kv.set('settings:config', settings);
    
    return c.json({ settings });
  } catch (error) {
    console.log('Update settings error:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-ee87e1bb/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize database with dummy data (development only)
app.post("/make-server-ee87e1bb/init-data", async (c) => {
  try {
    console.log('Starting database initialization...');
    
    // Import and run initialization
    const { initializeData } = await import("./init-helper.tsx");
    console.log('Helper module loaded successfully');
    
    const result = await initializeData();
    console.log('Initialization completed:', result);
    
    return c.json(result);
  } catch (error) {
    console.error('Init data error:', error);
    console.error('Error stack:', error.stack);
    return c.json({ 
      error: 'Failed to initialize data', 
      details: error.message,
      stack: error.stack 
    }, 500);
  }
});

Deno.serve(app.fetch);