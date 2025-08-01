const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS for frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const productRoutes = require('./routes/productRoutes');

// Mount routes
app.use('/api', productRoutes);
app.use('/', productRoutes);

// Admin routes - these should be after the API routes
app.get('/admin', (req, res) => {
  res.redirect('/admin/dashboard');
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin/index', { 
    title: 'Admin Dashboard',
    success: req.query.success || null
  });
});

// Add product routes
app.get('/admin/add-product', (req, res) => {
  res.render('admin/add-product', { 
    title: 'Add Product',
    error: null,
    formData: {
      title: '',
      description: '',
      price: '',
      category: '',
      discountAmount: '0',
      discountPercentage: '0'
    }
  });
});

// Handle form submission
const { createProduct } = require('./controllers/productController');
const { uploadSingleImage } = require('./middleware/multer');

app.post('/admin/add-product', uploadSingleImage, async (req, res) => {
  try {
    await createProduct(req, res);
  } catch (error) {
    console.error('Error in form submission:', error);
    res.status(500).render('error', {
      message: 'Server Error',
      error: { status: 500 }
    });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome' });
});

// 404 handler - this should be after all other routes
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page Not Found',
    error: { status: 404 }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : { status: 500 }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`API Endpoint: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
