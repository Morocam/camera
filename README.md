# Camera Landing Page - Enhanced Backend

A professional landing page for solar security cameras with a complete backend system for order management.

## Features

### Frontend
- 🎨 Modern Arabic-optimized design with Cairo font
- 📱 Fully responsive mobile-first approach
- 🛒 Cash on Delivery (COD) payment system
- 🔥 Urgency-driven conversion optimization
- ⚡ Fast loading with optimized images
- 🎯 Featured product showcase

### Backend
- 🚀 Node.js + Express server
- 🗄️ SQLite database for orders
- 🔐 JWT authentication for admin panel
- 📊 Real-time order management
- 🛡️ Security features (helmet, rate limiting)
- 📈 Dashboard with statistics
- ✅ Data validation and sanitization

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

### 4. Access Application
- **Landing Page**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html
- **Default Admin**: username: `admin`, password: `admin123`

## API Endpoints

### Public Endpoints
- `POST /api/orders` - Create new order

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/orders` - Get all orders with filters
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order
- `GET /api/dashboard/stats` - Get dashboard statistics

## Order Management

### Order Statuses
- `new` - جديد (New)
- `processing` - قيد المعالجة (Processing)
- `shipped` - تم الشحن (Shipped)
- `delivered` - تم التوصيل (Delivered)
- `cancelled` - ملغي (Cancelled)

### Admin Features
- Real-time order notifications
- Advanced filtering and search
- Bulk status updates
- Order analytics and reporting
- Secure authentication

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  camera_type TEXT NOT NULL,
  price INTEGER NOT NULL,
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevent abuse
- **JWT Authentication** - Secure admin access
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Prevent injection attacks
- **CORS Protection** - Cross-origin security

## Deployment

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

### VPS/Server
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name camera-app
pm2 startup
pm2 save
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `JWT_SECRET` | JWT signing key | Required |
| `NODE_ENV` | Environment | development |
| `DB_PATH` | Database file path | ./orders.db |

## Phone Number Integration

The system is configured for Moroccan phone numbers:
- **Contact**: 0664-345-640
- **WhatsApp**: +212664345640
- **Format**: Validates 10-digit Moroccan mobile numbers

## Product Configuration

### Camera Types
1. **Standard Camera** (999 DH)
   - 3 lenses + 1 solar panel
   
2. **Advanced Camera** (1149 DH) - Featured
   - 3 lenses + 2 solar panels + Memory card gift

## Support

For technical support or customization:
- 📧 Email: support@morosecurity.com
- 📱 WhatsApp: +212664345640
- 🌐 Website: https://github.com/Morocam/camera

## License

MIT License - Feel free to use and modify for your projects.

---

**MoroSecurity** - Professional Solar Security Camera Solutions