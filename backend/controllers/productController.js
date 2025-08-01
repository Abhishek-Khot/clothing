const Product = require('../models/Product');
const { uploadSingleImage, uploadGalleryImages } = require('../middleware/multer');
const path = require('path');
const fs = require('fs');

// @desc    Get admin dashboard
// @route   GET /admin/dashboard
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/index', { 
      title: 'Admin Dashboard',
      products,
      success: req.query.success || null
    });
  } catch (error) {
    res.status(500).render('error', { 
      message: 'Server Error',
      error: { status: 500 }
    });
  }
};

// @desc    Create a new product (for traditional form submission)
// @route   POST /admin/add-product
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, description, discountAmount = 0, discountPercentage = 0 } = req.body;

    // Sizes: ensure array
    let sizes = req.body.sizes || [];
    if (!Array.isArray(sizes)) sizes = [sizes];

    // Prepare form data for re-rendering in case of errors
    const formData = {
      title,
      description,
      price,
      category,
      discountAmount,
      discountPercentage,
      sizes
    };

    // Basic validation
    if (!title || !price || !category || !description || sizes.length === 0) {
      return res.status(400).render('admin/add-product', {
        title: 'Add Product',
        error: 'Please fill in all required fields and select at least one size',
        formData
      });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.length) {
      return res.status(400).render('admin/add-product', {
        title: 'Add Product',
        error: 'Please upload at least one product image',
        formData
      });
    }

    // Create product
    const gallery = req.files.map(f => `/uploads/${f.filename}`);
    const product = new Product({
      title,
      price: parseFloat(price),
      srcUrl: gallery[0],
      gallery,
      category,
      sizes,
      description,
      discount: {
        amount: parseFloat(discountAmount) || 0,
        percentage: parseFloat(discountPercentage) || 0
      },
      rating: 0 // Default rating
    });

    await product.save();
    res.redirect('/admin/dashboard?success=Product added successfully');
  } catch (error) {
    // If there were files uploaded but an error occurred, delete them
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../public/uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    // Prepare form data for re-rendering
    const formData = {
      title: req.body.title || '',
      description: req.body.description || '',
      price: req.body.price || '',
      category: req.body.category || '',
      discountAmount: req.body.discountAmount || '0',
      discountPercentage: req.body.discountPercentage || '0',
      sizes: req.body.sizes || []
    };
    res.status(500).render('admin/add-product', {
      title: 'Add Product',
      error: 'Error adding product. Please try again.',
      formData
    });
  }
};

// @desc    Get all products (with filtering, sorting, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Filters
    const { category, size, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 12, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (size) query.sizes = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;
    // Sorting
    let sortObj = {};
    if (sort === 'price-asc') sortObj.price = 1;
    else if (sort === 'price-desc') sortObj.price = -1;
    else if (sort === 'newest') sortObj.createdAt = -1;
    else if (sort === 'oldest') sortObj.createdAt = 1;
    else sortObj = { createdAt: -1 };
    // Query
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Delete the image file if it exists
    if (product.srcUrl) {
      const imagePath = path.join(__dirname, '../public', product.srcUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Render edit product page
// @route   GET /admin/edit-product/:id
// @access  Private/Admin
exports.editProductPage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found', error: { status: 404 } });
    }
    res.render('admin/edit-product', {
      title: 'Edit Product',
      error: null,
      formData: {
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        discountAmount: product.discount?.amount || 0,
        discountPercentage: product.discount?.percentage || 0,
        srcUrl: product.srcUrl,
        sizes: product.sizes
      },
      productId: product._id
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error', error: { status: 500 } });
  }
};

// @desc    Update product
// @route   POST /admin/edit-product/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, category, description, discountAmount = 0, discountPercentage = 0 } = req.body;
    let sizes = req.body.sizes || [];
    if (!Array.isArray(sizes)) sizes = [sizes];
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found', error: { status: 404 } });
    }
    // Update fields
    product.title = title;
    product.price = parseFloat(price);
    product.category = category;
    product.description = description;
    product.sizes = sizes;
    product.discount = {
      amount: parseFloat(discountAmount) || 0,
      percentage: parseFloat(discountPercentage) || 0
    };
    // If new images were uploaded, add them to the gallery
    if (req.files && req.files.length) {
      // Optionally: delete old gallery images if you want to replace
      // req.files.map(f => ... )
      product.gallery = req.files.map(f => `/uploads/${f.filename}`);
      product.srcUrl = product.gallery[0];
    }
    await product.save();
    res.redirect('/admin/dashboard?success=Product updated successfully');
  } catch (error) {
    // If there were files uploaded but an error occurred, delete them
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../public/uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    // Re-render the edit form with previous values and error message
    res.status(500).render('admin/edit-product', {
      title: 'Edit Product',
      error: 'Error updating product. Please try again.',
      formData: req.body,
      productId: req.params.id
    });
  }
};
