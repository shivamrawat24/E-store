const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const CLOUDINARY_FOLDER = 'ecommerce/categories';

/**
 * @route   GET /api/v1/categories
 * @desc    List categories. Public callers only see active ones;
 *          pass ?all=true (admin UI) to include inactive categories.
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { isActive: true };
  const categories = await Category.find(filter).populate('parent', 'name slug').sort('name');
  return res.status(200).json(new ApiResponse(200, { categories, count: categories.length }, 'Categories fetched.'));
});

/**
 * @route   GET /api/v1/categories/:idOrSlug
 * @access  Public
 */
const getCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const category = await Category.findOne(query).populate('parent', 'name slug');
  if (!category) throw ApiError.notFound('Category not found.');

  return res.status(200).json(new ApiResponse(200, { category }, 'Category fetched.'));
});

/**
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parent, isActive } = req.body;

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) throw ApiError.conflict('A category with this name already exists.');

  let image;
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);
    image = uploaded;
  }

  const category = await Category.create({
    name,
    description,
    parent: parent || null,
    isActive: isActive ?? true,
    ...(image && { image }),
  });

  return res.status(201).json(new ApiResponse(201, { category }, 'Category created successfully.'));
});

/**
 * @route   PATCH /api/v1/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found.');

  const { name, description, parent, isActive } = req.body;

  if (name && name.trim() !== category.name) {
    const existing = await Category.findOne({ name: name.trim(), _id: { $ne: category._id } });
    if (existing) throw ApiError.conflict('A category with this name already exists.');
    category.name = name;
  }
  if (description !== undefined) category.description = description;
  if (parent !== undefined) category.parent = parent || null;
  if (isActive !== undefined) category.isActive = isActive;

  if (req.file) {
    const oldPublicId = category.image?.publicId;
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);
    category.image = uploaded;
    if (oldPublicId) await deleteFromCloudinary(oldPublicId);
  }

  await category.save();

  return res.status(200).json(new ApiResponse(200, { category }, 'Category updated successfully.'));
});

/**
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found.');

  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete this category: ${productCount} product(s) are still assigned to it. Reassign or delete them first.`
    );
  }

  if (category.image?.publicId) {
    await deleteFromCloudinary(category.image.publicId);
  }

  await category.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully.'));
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
