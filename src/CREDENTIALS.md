# M&A Perfumes - Admin Credentials & Setup Guide

## 🚀 Quick Start

When you first run the application, you'll be presented with a **Database Initialization** page. This is your starting point to set up the application with sample data.

## 📋 Database Initialization

### Step 1: Initialize the Database

1. On the initialization page, click the **"Initialize Database Now"** button
2. Wait for the process to complete (usually takes 2-3 seconds)
3. You'll see a success message with a summary of created data

### Step 2: What Gets Created

The initialization process creates:

- **1 Admin Account** - For accessing the admin dashboard
- **12 Products** - Sample luxury perfumes with images and details
- **4 Orders** - Sample orders in various states (pending, processing, shipped, delivered)
- **3 Complaints** - Sample customer complaints and inquiries
- **Settings** - Default store settings (delivery charges, etc.)

## 🔐 Admin Login Credentials

After initialization, use these credentials to access the admin panel:

```
Email:    admin@maperfumes.com
Password: Admin123!
```

**⚠️ Important:** These are the default credentials. In a production environment, you should change these immediately after your first login.

## 🧪 Test Data

### Order Tracking Test

You can test the order tracking feature using:

```
Order Number: MA12345678
Phone: +92-300-1234567
```

### Sample Products

The database includes 12 luxury perfumes across different categories:
- Oud
- Floral
- Fresh
- Oriental
- Woody
- Musk

## 📱 Application Features

### Customer Side
- Browse products
- View product details
- Add to cart
- Checkout (Cash on Delivery only)
- Track orders using Order ID + Phone
- Submit complaints/feedback
- No login required for customers

### Admin Side (Requires Login)
- **Products Tab**: Create, edit, delete products and manage inventory
- **Orders Tab**: View all orders, update order status, filter by status
- **Complaints Tab**: View and manage customer complaints
- **Settings Tab**: Configure delivery charges and other store settings

## 🔄 Re-initialization

You can run the initialization process multiple times. The system will:
- Skip creating the admin user if it already exists
- Add new sample products each time
- Add new sample orders each time

## 🌐 Accessing Different Pages

After initialization:
1. Click **"Go to Application"** to navigate to the home page
2. Navigate to **"Admin"** from the header to access the login page
3. Use the credentials above to log into the admin dashboard

## 🛠️ Technical Details

- **Backend**: Supabase Edge Functions with Hono framework
- **Database**: Supabase KV Store
- **Authentication**: Supabase Auth (for admin only)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Payment**: Cash on Delivery (COD) only

## 📞 Support

For any issues or questions regarding the setup, please contact the development team.

---

**Last Updated**: January 2026
