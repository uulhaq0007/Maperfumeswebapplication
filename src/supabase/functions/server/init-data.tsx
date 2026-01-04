import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Admin credentials
const ADMIN_EMAIL = "admin@maperfumes.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "M&A Admin";

console.log("\n🚀 Starting database initialization...\n");

// Create admin user
console.log("📝 Creating admin user...");
try {
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    user_metadata: { name: ADMIN_NAME, role: 'admin' },
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log("⚠️  Admin user already exists, skipping creation");
    } else {
      throw error;
    }
  } else {
    // Store admin flag in kv store
    await kv.set(`admin:${data.user.id}`, {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    console.log("✅ Admin user created successfully!");
  }
} catch (error) {
  console.error("❌ Error creating admin user:", error);
}

// Dummy products data
console.log("\n📦 Creating products...");
const products = [
  {
    name: "Oud Royale",
    description: "A luxurious blend of pure oud wood and amber, perfect for special occasions. This exquisite fragrance captures the essence of Arabian luxury with deep, woody notes that linger throughout the day.",
    price: 8500,
    discountPrice: 7500,
    category: "Oud",
    stock: 50,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    notes: ["Oud Wood", "Amber", "Musk", "Sandalwood"],
    size: "100ml",
    status: "active",
  },
  {
    name: "Midnight Rose",
    description: "An enchanting floral fragrance with notes of Bulgarian rose and jasmine. Perfect for evening wear, this sophisticated scent combines elegance with mystery.",
    price: 6500,
    discountPrice: null,
    category: "Floral",
    stock: 35,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    notes: ["Bulgarian Rose", "Jasmine", "Vanilla", "Patchouli"],
    size: "75ml",
    status: "active",
  },
  {
    name: "Citrus Breeze",
    description: "A fresh and invigorating citrus scent ideal for daily wear. Bursting with energy, this fragrance combines zesty citrus notes with a subtle woody base.",
    price: 4500,
    discountPrice: 3999,
    category: "Fresh",
    stock: 80,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    notes: ["Bergamot", "Lemon", "Orange", "Cedar"],
    size: "50ml",
    status: "active",
  },
  {
    name: "Velvet Musk",
    description: "A warm and sensual musk fragrance with hints of vanilla. This timeless classic wraps you in comfort and sophistication.",
    price: 7200,
    discountPrice: null,
    category: "Musk",
    stock: 45,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    notes: ["White Musk", "Vanilla", "Tonka Bean", "Amber"],
    size: "100ml",
    status: "active",
  },
  {
    name: "Amber Noir",
    description: "Deep amber blended with spicy notes for a mysterious allure. A bold fragrance that makes a statement wherever you go.",
    price: 9000,
    discountPrice: 8200,
    category: "Oriental",
    stock: 25,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    notes: ["Amber", "Black Pepper", "Cardamom", "Leather"],
    size: "100ml",
    status: "active",
  },
  {
    name: "Ocean Breeze",
    description: "Fresh aquatic fragrance reminiscent of sea breezes. Escape to the coast with this clean, refreshing scent.",
    price: 5500,
    discountPrice: null,
    category: "Fresh",
    stock: 60,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
    notes: ["Sea Salt", "Mint", "Lavender", "Driftwood"],
    size: "75ml",
    status: "active",
  },
  {
    name: "Saffron Gold",
    description: "Precious saffron combined with golden amber and spices. An opulent fragrance fit for royalty.",
    price: 12000,
    discountPrice: 10500,
    category: "Oriental",
    stock: 15,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80",
    notes: ["Saffron", "Amber", "Cinnamon", "Agarwood"],
    size: "100ml",
    status: "active",
  },
  {
    name: "White Gardenia",
    description: "Elegant white floral with creamy gardenia petals. A sophisticated fragrance that exudes pure elegance.",
    price: 7800,
    discountPrice: null,
    category: "Floral",
    stock: 40,
    image: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800&q=80",
    notes: ["Gardenia", "Tuberose", "Coconut", "Musk"],
    size: "75ml",
    status: "active",
  },
  {
    name: "Cedar Spice",
    description: "Woody cedar blended with warm spices for a masculine scent. Strong, confident, and unforgettable.",
    price: 6800,
    discountPrice: 5999,
    category: "Woody",
    stock: 55,
    image: "https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&q=80",
    notes: ["Cedar", "Nutmeg", "Black Pepper", "Vetiver"],
    size: "100ml",
    status: "active",
  },
  {
    name: "Lavender Dreams",
    description: "Calming lavender with soft vanilla undertones. A soothing fragrance perfect for relaxation.",
    price: 4200,
    discountPrice: null,
    category: "Fresh",
    stock: 70,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
    notes: ["Lavender", "Vanilla", "Chamomile", "Tonka Bean"],
    size: "50ml",
    status: "active",
  },
  {
    name: "Royal Jasmine",
    description: "Pure jasmine essence captured in a bottle. Intoxicating and romantic.",
    price: 8800,
    discountPrice: 7999,
    category: "Floral",
    stock: 30,
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80",
    notes: ["Jasmine", "Rose", "Ylang-Ylang", "Sandalwood"],
    size: "75ml",
    status: "active",
  },
  {
    name: "Tobacco Leather",
    description: "Rich tobacco blended with smooth leather notes. Masculine, bold, and timeless.",
    price: 9500,
    discountPrice: null,
    category: "Oriental",
    stock: 20,
    image: "https://images.unsplash.com/photo-1565731840293-0ce49c1f2f78?w=800&q=80",
    notes: ["Tobacco", "Leather", "Honey", "Tonka Bean"],
    size: "100ml",
    status: "active",
  },
];

for (const productData of products) {
  const id = generateId();
  const product = {
    id,
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`product:${id}`, product);
  console.log(`✅ Created product: ${product.name}`);
}

// Dummy orders
console.log("\n📋 Creating sample orders...");
const orders = [
  {
    orderNumber: "MA12345678",
    customerName: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+92-300-1234567",
    address: "123 Main Street, Karachi",
    city: "Karachi",
    items: [
      { productId: "dummy1", name: "Oud Royale", price: 7500, quantity: 1 },
      { productId: "dummy2", name: "Midnight Rose", price: 6500, quantity: 1 },
    ],
    subtotal: 14000,
    deliveryCharge: 200,
    total: 14200,
    status: "pending",
    paymentMethod: "cod",
  },
  {
    orderNumber: "MA12345679",
    customerName: "Fatima Ali",
    email: "fatima.ali@example.com",
    phone: "+92-321-9876543",
    address: "456 Garden Road, Lahore",
    city: "Lahore",
    items: [
      { productId: "dummy3", name: "Citrus Breeze", price: 3999, quantity: 2 },
    ],
    subtotal: 7998,
    deliveryCharge: 200,
    total: 8198,
    status: "processing",
    paymentMethod: "cod",
  },
  {
    orderNumber: "MA12345680",
    customerName: "Hassan Malik",
    email: "hassan.malik@example.com",
    phone: "+92-333-5551234",
    address: "789 University Road, Islamabad",
    city: "Islamabad",
    items: [
      { productId: "dummy5", name: "Amber Noir", price: 8200, quantity: 1 },
    ],
    subtotal: 8200,
    deliveryCharge: 200,
    total: 8400,
    status: "shipped",
    paymentMethod: "cod",
  },
  {
    orderNumber: "MA12345681",
    customerName: "Ayesha Siddiqui",
    email: "ayesha.s@example.com",
    phone: "+92-345-7778888",
    address: "321 Mall Road, Faisalabad",
    city: "Faisalabad",
    items: [
      { productId: "dummy7", name: "Saffron Gold", price: 10500, quantity: 1 },
      { productId: "dummy8", name: "White Gardenia", price: 7800, quantity: 1 },
    ],
    subtotal: 18300,
    deliveryCharge: 200,
    total: 18500,
    status: "delivered",
    paymentMethod: "cod",
  },
];

for (const orderData of orders) {
  const id = generateId();
  const order = {
    id,
    ...orderData,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last week
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`order:${id}`, order);
  await kv.set(`orderByNumber:${order.orderNumber}`, order);
  console.log(`✅ Created order: ${order.orderNumber}`);
}

// Dummy complaints
console.log("\n💬 Creating sample complaints...");
const complaints = [
  {
    name: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    phone: "+92-300-1112233",
    orderNumber: "MA12345678",
    subject: "Product Quality Issue",
    message: "The perfume bottle arrived with a small crack on the cap. The fragrance is great but I'm concerned about leakage.",
    status: "pending",
  },
  {
    name: "Ali Raza",
    email: "ali.raza@example.com",
    phone: "+92-321-4445566",
    orderNumber: "MA12345679",
    subject: "Delivery Delay",
    message: "My order was supposed to arrive in 3-5 business days but it's been a week. Please update the status.",
    status: "resolved",
  },
  {
    name: "Zainab Khan",
    email: "zainab.k@example.com",
    phone: "+92-333-7778899",
    orderNumber: "",
    subject: "General Inquiry",
    message: "Do you offer gift wrapping services? I want to order for a special occasion.",
    status: "pending",
  },
];

for (const complaintData of complaints) {
  const id = generateId();
  const complaint = {
    id,
    ...complaintData,
    createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 5 days
  };
  
  await kv.set(`complaint:${id}`, complaint);
  console.log(`✅ Created complaint from: ${complaint.name}`);
}

// Settings
console.log("\n⚙️  Creating settings...");
const settings = {
  deliveryCharge: 200,
  currency: 'PKR',
  deliveryDays: '3-5 business days',
  minOrderAmount: 0,
  freeDeliveryThreshold: 15000,
};

await kv.set('settings:config', settings);
console.log("✅ Settings configured");

console.log("\n✨ Database initialization completed!\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔐 ADMIN CREDENTIALS");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Email:    ${ADMIN_EMAIL}`);
console.log(`Password: ${ADMIN_PASSWORD}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("📊 DATA SUMMARY:");
console.log(`   • Products: ${products.length}`);
console.log(`   • Orders: ${orders.length}`);
console.log(`   • Complaints: ${complaints.length}`);
console.log("\n🎯 Test Order Tracking:");
console.log("   Order Number: MA12345678");
console.log("   Phone: +92-300-1234567\n");
