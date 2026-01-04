# M&A Perfumes - Setup Guide

## Welcome to M&A Perfumes E-Commerce Platform

This is a complete perfume e-commerce application with customer-facing store and admin dashboard.

### 🚀 Getting Started

#### 1. Create Admin Account
First, create an admin account to manage your store:

1. Click "Admin" in the header
2. Click "Need an admin account? Sign up"
3. Fill in your details:
   - Name: Your full name
   - Email: Your admin email
   - Password: At least 6 characters
4. Click "Create Account"
5. Sign in with your credentials

#### 2. Add Products
Once logged in to the admin dashboard:

1. Go to the "Products" tab
2. Click "Add Product"
3. Fill in product details:
   - **Required**: Name, Price, Category, Size, Stock
   - **Optional**: Image URL, Description, Fragrance Notes
4. Click "Create Product"

**Sample Product Data:**
```
Name: Oud Royale
Price: 4500
Category: Unisex
Size: 100ml
Stock: 15
Image: https://images.unsplash.com/photo-1592400374401-002fe1d25961
Description: A luxurious blend of oud and amber
Top Notes: Bergamot, Saffron
Middle Notes: Rose, Oud
Base Notes: Amber, Musk
```

#### 3. Configure Store Settings
1. Go to "Settings" tab
2. Configure:
   - Delivery Charge (default: PKR 200)
   - Estimated Delivery Time (default: 3-5 business days)
3. Click "Save Settings"

### 📦 Features

#### Customer Side (No Login Required)
- **Browse Products**: View all available perfumes with filters and search
- **Product Details**: See detailed information including fragrance notes
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout**: Cash on Delivery (COD) with Pakistan-specific fields
- **Order Tracking**: Track orders using Order Number + Phone Number
- **Contact Form**: Submit inquiries and complaints

#### Admin Dashboard (Login Required)
- **Products Management**: Create, edit, delete products; manage inventory
- **Orders Management**: View all orders, update order status
- **Messages**: View and respond to customer complaints/inquiries
- **Settings**: Configure delivery charges and other store settings

### 🎨 Design Features

- **Premium Design**: Luxury perfume brand aesthetic
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, minimal design with smooth transitions
- **Optimized Images**: Uses Unsplash for high-quality product imagery

### 🇵🇰 Pakistan-Specific Features

- **Cash on Delivery**: Primary payment method
- **Local Delivery**: City-based delivery across Pakistan
- **PKR Currency**: All prices in Pakistani Rupees
- **Phone Verification**: Order tracking with phone number

### 📱 Order Flow

1. **Customer**: Browse products → Add to cart → Checkout with COD
2. **System**: Generate order number → Send to admin
3. **Admin**: View order → Update status (Pending → Confirmed → Shipped → Delivered)
4. **Customer**: Track order anytime using order number and phone

### 🔐 Security Notes

**IMPORTANT**: This is a demo/prototype application. For production use:
- Implement proper PII (Personally Identifiable Information) security
- Add SSL/TLS encryption
- Use secure payment gateways if adding online payments
- Implement proper authentication and authorization
- Add email/SMS notifications
- Set up proper database backup procedures

### 🛠️ Technology Stack

- **Frontend**: React + TypeScript
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase (PostgreSQL with KV store)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library

### 📊 Order Status Flow

```
Pending → Order received, waiting for confirmation
Confirmed → Order confirmed, preparing for shipment  
Shipped → Order dispatched, in transit
Delivered → Order successfully delivered
Cancelled → Order cancelled
```

### 💡 Tips

1. **Add Sample Products**: Start with 5-10 products to showcase your store
2. **Use Good Images**: High-quality product images increase trust
3. **Update Order Status**: Keep customers informed by updating order status promptly
4. **Respond to Messages**: Check the Messages tab regularly
5. **Monitor Inventory**: Update stock quantities to prevent overselling

### 🆘 Troubleshooting

**Can't login to admin?**
- Make sure you created an admin account (not just signed up as a user)
- Check your email and password
- Try signing up again if needed

**Products not showing?**
- Make sure product status is set to "Active"
- Check that stock quantity is greater than 0
- Refresh the page

**Order tracking not working?**
- Verify the order number is correct
- Ensure phone number matches the one used during checkout
- Phone number format: 03XX XXXXXXX

### 📞 Sample Contact Information

The app comes with placeholder contact details. Update these in:
- Footer component: `/components/Footer.tsx`
- Contact page: `/components/Contact.tsx`

---

**Ready to start?** Create your admin account and add your first product!
