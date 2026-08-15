const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadMultipleToCloudinary, deleteManyFromCloudinary } = require('../utils/cloudinaryUpload');

const CLOUDINARY_FOLDER = 'ecommerce/products';

/**
 * @route   GET /api/v1/products
 * @desc    List products with search, filter, sort, and pagination.
 *          Non-admin callers are always restricted to status=active.
 * @access  Public
 * @query   search, category, brand, status, price[gte], price[lte],
 *          isFeatured, isBestSeller, sort, fields, page, limit
 */
const getProducts = asyncHandler(async (req, res) => {
  const baseFilter = req.user?.role === 'admin' ? {} : { status: 'active' };

  let query = Product.find(baseFilter).populate('category', 'name slug').populate('brand', 'name slug');

  const features = new ApiFeatures(query, req.query)
    .search(['name', 'description', 'tags', 'shortDescription'])
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [products, total] = await Promise.all([
    features.query,
    Product.countDocuments({ ...baseFilter, ...buildCountFilter(req.query) }),
  ]);

  const { page, limit } = features.pagination;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page,
          limit,
          totalResults: total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      'Products fetched.'
    )
  );
});

/**
 * Rebuilds a plain filter object (mirroring ApiFeatures.filter's logic) so
 * we can run an accurate countDocuments() in parallel with the paginated query.
 */
function buildCountFilter(queryString) {
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'keyword'];
  const queryObj = { ...queryString };
  excludedFields.forEach((field) => delete queryObj[field]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  return JSON.parse(queryStr);
}

/**
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 8, 50);
  const products = await Product.find({ isFeatured: true, status: 'active' })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(limit);

  return res.status(200).json(new ApiResponse(200, { products }, 'Featured products fetched.'));
});

/**
 * @route   GET /api/v1/products/best-sellers
 * @access  Public
 */
const getBestSellers = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 8, 50);
  const products = await Product.find({ isBestSeller: true, status: 'active' })
    .populate('category', 'name slug')
    .sort('-ratingsAverage')
    .limit(limit);

  return res.status(200).json(new ApiResponse(200, { products }, 'Best sellers fetched.'));
});

/**
 * @route   GET /api/v1/products/:idOrSlug
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const product = await Product.findOne(query).populate('category', 'name slug').populate('brand', 'name slug');
  if (!product) throw ApiError.notFound('Product not found.');

  if (product.status !== 'active' && req.user?.role !== 'admin') {
    throw ApiError.notFound('Product not found.');
  }

  return res.status(200).json(new ApiResponse(200, { product }, 'Product fetched.'));
});

/**
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { category, sku } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) throw ApiError.badRequest('The selected category does not exist.');

  const existingSku = await Product.findOne({ sku: sku.trim().toUpperCase() });
  if (existingSku) throw ApiError.conflict('A product with this SKU already exists.');

  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('At least one product image is required.');
  }

  const images = await uploadMultipleToCloudinary(req.files, CLOUDINARY_FOLDER);

  try {
    const product = await Product.create({
      ...req.body,
      brand: req.body.brand || null,
      images,
      tags: parseTags(req.body.tags),
      createdBy: req.user._id,
    });

    const populated = await product.populate([
      { path: 'category', select: 'name slug' },
      { path: 'brand', select: 'name slug' },
    ]);

    return res.status(201).json(new ApiResponse(201, { product: populated }, 'Product created successfully.'));
  } catch (error) {
    // Roll back uploaded images if the DB write failed
    await deleteManyFromCloudinary(images.map((img) => img.publicId));
    throw error;
  }
});

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    Updates fields; optionally appends newly uploaded images and/or
 *          removes specific images via `removedImageIds` (comma-separated
 *          Cloudinary public IDs) in the body.
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');

  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) throw ApiError.badRequest('The selected category does not exist.');
  }

  if (req.body.sku && req.body.sku.trim().toUpperCase() !== product.sku) {
    const existingSku = await Product.findOne({ sku: req.body.sku.trim().toUpperCase(), _id: { $ne: product._id } });
    if (existingSku) throw ApiError.conflict('A product with this SKU already exists.');
  }

  const updatableFields = [
    'name',
    'description',
    'shortDescription',
    'price',
    'comparePrice',
    'sku',
    'category',
    'brand',
    'stock',
    'lowStockThreshold',
    'status',
    'isFeatured',
    'isBestSeller',
  ];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field] || null;
  });

  if (req.body.tags !== undefined) product.tags = parseTags(req.body.tags);

  // Remove specific images if requested
  if (req.body.removedImageIds) {
    const idsToRemove = req.body.removedImageIds.split(',').map((s) => s.trim());
    await deleteManyFromCloudinary(idsToRemove);
    product.images = product.images.filter((img) => !idsToRemove.includes(img.publicId));
  }

  // Append newly uploaded images
  if (req.files && req.files.length > 0) {
    const newImages = await uploadMultipleToCloudinary(req.files, CLOUDINARY_FOLDER);
    product.images.push(...newImages);
  }

  if (product.images.length === 0) {
    throw ApiError.badRequest('A product must have at least one image.');
  }

  await product.save();

  const populated = await product.populate([
    { path: 'category', select: 'name slug' },
    { path: 'brand', select: 'name slug' },
  ]);

  return res.status(200).json(new ApiResponse(200, { product: populated }, 'Product updated successfully.'));
});

/**
 * @route   PATCH /api/v1/products/:id/stock
 * @access  Private/Admin
 */
const updateStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');

  product.stock = req.body.stock;
  await product.save();

  return res.status(200).json(new ApiResponse(200, { product }, 'Stock updated successfully.'));
});

/**
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');

  await deleteManyFromCloudinary(product.images.map((img) => img.publicId));
  await product.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully.'));
});

function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
}

module.exports = {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
};
