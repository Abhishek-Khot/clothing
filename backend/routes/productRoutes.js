const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getProducts, 
  getProduct,
  deleteProduct,
  getAdminDashboard,
  addProductPage,
  editProductPage,
  updateProduct
} = require('../controllers/productController');
const { uploadGalleryImages } = require('../middleware/multer');

// Admin dashboard
router.get('/admin/dashboard', async (req, res, next) => {
  try {
    await getAdminDashboard(req, res);
  } catch (error) {
    next(error);
  }
});

// Admin add product page (GET and POST)
router.route('/admin/add-product')
  .get((req, res) => {
    res.render('admin/add-product', { 
      title: 'Add Product',
      error: null,
      formData: {}
    });
  })
  .post(uploadGalleryImages, async (req, res, next) => {
    try {
      await createProduct(req, res, next);
    } catch (error) {
      next(error);
    }
  });

// Admin edit product page (GET and POST)
router.route('/admin/edit-product/:id')
  .get(async (req, res, next) => {
    try {
      await editProductPage(req, res);
    } catch (error) {
      next(error);
    }
  })
  .post(uploadGalleryImages, async (req, res, next) => {
    try {
      await updateProduct(req, res);
    } catch (error) {
      next(error);
    }
  });

// API Routes
router.get('/products', async (req, res, next) => {
  try {
    await getProducts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    await getProduct(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    await deleteProduct(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
