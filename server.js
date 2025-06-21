const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Initialize SQLite database
const db = new sqlite3.Database('./orders.db');

// Create tables
db.serialize(() => {
  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    camera_type TEXT NOT NULL,
    price INTEGER NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admin users table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create default admin user (username: admin, password: admin123)
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)`, 
    ['admin', hashedPassword]);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Validate order data
const validateOrder = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('الاسم مطلوب ويجب أن يكون أكثر من حرفين');
  }
  
  if (!data.phone || !validator.isMobilePhone(data.phone, 'ar-MA')) {
    errors.push('رقم الهاتف غير صحيح');
  }
  
  if (!data.city || data.city.trim().length < 2) {
    errors.push('المدينة مطلوبة');
  }
  
  if (!data.cameraType || !['999', '1149'].includes(data.cameraType)) {
    errors.push('نوع الكاميرا غير صحيح');
  }
  
  return errors;
};

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, message: 'تم تسجيل الدخول بنجاح' });
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Create new order
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    const errors = validateOrder(orderData);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const price = orderData.cameraType === '1149' ? 1149 : 999;
    
    db.run(
      `INSERT INTO orders (name, phone, city, camera_type, price) VALUES (?, ?, ?, ?, ?)`,
      [orderData.name.trim(), orderData.phone, orderData.city.trim(), orderData.cameraType, price],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'خطأ في حفظ الطلب' });
        }
        
        res.status(201).json({ 
          id: this.lastID,
          message: 'تم إرسال الطلب بنجاح',
          orderId: this.lastID
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Get all orders (admin only)
app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    const { status, date, search, page = 1, limit = 50 } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(created_at) = ?';
      params.push(date);
    }

    if (search) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR city LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    db.all(query, params, (err, orders) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'خطأ في جلب الطلبات' });
      }

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
      const countParams = [];

      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }

      if (date) {
        countQuery += ' AND DATE(created_at) = ?';
        countParams.push(date);
      }

      if (search) {
        countQuery += ' AND (name LIKE ? OR phone LIKE ? OR city LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }

      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'خطأ في جلب الطلبات' });
        }

        res.json({
          orders,
          total: countResult.total,
          page: parseInt(page),
          totalPages: Math.ceil(countResult.total / parseInt(limit))
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Get order by ID (admin only)
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'خطأ في جلب الطلب' });
      }
      
      if (!order) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
      }
      
      res.json(order);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Update order status (admin only)
app.put('/api/orders/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'حالة الطلب غير صحيحة' });
    }
    
    db.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'خطأ في تحديث الطلب' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'الطلب غير موجود' });
        }
        
        res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Delete order (admin only)
app.delete('/api/orders/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'خطأ في حذف الطلب' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
      }
      
      res.json({ message: 'تم حذف الطلب بنجاح' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Get dashboard stats (admin only)
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const queries = [
      'SELECT COUNT(*) as total FROM orders',
      'SELECT COUNT(*) as new_orders FROM orders WHERE status = "new"',
      'SELECT COUNT(*) as processing FROM orders WHERE status = "processing"',
      'SELECT COUNT(*) as delivered FROM orders WHERE status = "delivered"',
      'SELECT SUM(price) as total_revenue FROM orders WHERE status = "delivered"',
      'SELECT COUNT(*) as today_orders FROM orders WHERE DATE(created_at) = DATE("now")'
    ];

    Promise.all(queries.map(query => 
      new Promise((resolve, reject) => {
        db.get(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      })
    )).then(results => {
      res.json({
        totalOrders: results[0].total || 0,
        newOrders: results[1].new_orders || 0,
        processingOrders: results[2].processing || 0,
        deliveredOrders: results[3].delivered || 0,
        totalRevenue: results[4].total_revenue || 0,
        todayOrders: results[5].today_orders || 0
      });
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'خطأ في الخادم' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'الصفحة غير موجودة' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`Default admin credentials: admin / admin123`);
});

module.exports = app;