# M&A Perfumes - Premium E-Commerce Platform

A modern, fully-responsive perfume e-commerce web application with customer-facing store and secure admin dashboard.

## 🌟 Features

### Customer Experience
- **Product Catalog**: Browse luxury perfumes with advanced filtering and search
- **Product Details**: View detailed information including fragrance notes (top, middle, base)
- **Shopping Cart**: Intuitive cart management with quantity controls
- **Cash on Delivery**: Pakistan-friendly COD payment method
- **Order Tracking**: Track orders using Order Number + Phone (no login required)
- **Contact Support**: Submit inquiries and complaints

### Admin Dashboard
- **Product Management**: Full CRUD operations for products and inventory
- **Order Management**: View and update order status (Pending → Confirmed → Shipped → Delivered)
- **Customer Messages**: View and respond to customer inquiries
- **Store Settings**: Configure delivery charges and policies
- **Secure Authentication**: JWT-based admin login

## 🚀 Quick Start

1. **Access the Application**: Open the app in your browser
2. **Create Admin Account**: Click "Admin" → "Sign up" → Fill in details
3. **Add Products**: Login to admin → Products tab → Add Product
4. **Configure Store**: Settings tab → Set delivery charge and policies
5. **Start Selling**: Customers can now browse and order!

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## 🇵🇰 Pakistan-Specific Features

- Cash on Delivery (COD) payment
- PKR currency throughout
- City-based delivery
- Local phone number format (03XX XXXXXXX)
- 3-5 business days delivery estimate

## 🎨 Design

Inspired by premium perfume brands with:
- Clean, minimal aesthetic
- Luxury typography
- Smooth animations and transitions
- High-quality imagery (via Unsplash)
- Fully responsive (mobile, tablet, desktop)

## 🛠️ Technology

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase (PostgreSQL + KV Store)
- **Authentication**: Supabase Auth (JWT)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui inspired components

## 📦 Order Flow

```
Customer:
1. Browse products
2. Add to cart
3. Checkout (provide name, phone, city, address)
4. Receive order number
5. Track order anytime

Admin:
1. Receive order notification
2. Update status: Pending → Confirmed → Shipped → Delivered
3. Manage inventory
4. Respond to customer messages
```

## 🔐 Security Notice

⚠️ **Important**: This is a prototype/demo application designed for learning and demonstration purposes.

For production use, you must:
- Implement proper PII security measures
- Add SSL/TLS encryption
- Set up secure payment processing
- Implement proper access controls
- Add email/SMS notifications
- Configure proper database backups
- Follow GDPR/data protection regulations

## 📱 Pages

### Customer Pages
- **Home**: Hero section, featured products, about section
- **Products**: Full catalog with search and filters
- **Product Detail**: Detailed view with fragrance notes and stock info
- **Cart**: Shopping cart with quantity management
- **Checkout**: COD checkout form with delivery details
- **Order Tracking**: Track order status
- **Contact**: Contact form and FAQ

### Admin Pages
- **Admin Login**: Secure authentication
- **Dashboard**: Unified admin interface with tabs:
  - Products: Manage products and inventory
  - Orders: View and update order status
  - Messages: Customer inquiries and complaints
  - Settings: Store configuration

## 🎯 Sample Product

```json
{
  "name": "Oud Royale",
  "price": 4500,
  "category": "Unisex",
  "size": "100ml",
  "stock": 15,
  "description": "A luxurious blend of oud and amber, perfect for special occasions",
  "topNotes": "Bergamot, Saffron",
  "middleNotes": "Rose, Oud",
  "baseNotes": "Amber, Musk",
  "status": "active"
}
```

## 📞 Support

For questions about this application:
1. Check [SETUP.md](./SETUP.md) for setup instructions
2. Review the troubleshooting section
3. Contact the development team

## 📄 License

This is a demo application built for Figma Make. Use as a template for your own projects.

---

**Built with ❤️ for M&A Perfumes**
