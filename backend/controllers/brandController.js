const Brand = require('../models/Brand');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const CLOUDINARY_FOLDER = 'ecommerce/brands';

const getBrands = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { isActive: true };
  const brands = await Brand.find(filter).sort('name');
  return res.status(200).json(new ApiResponse(200, { brands, count: brands.length }, 'Brands fetched.'));
});

const getBrand = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const brand = await Brand.findOne(query);
  if (!brand) throw ApiError.notFound('Brand not found.');

  return res.status(200).json(new ApiResponse(200, { brand }, 'Brand fetched.'));
});

const createBrand = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;

  const existing = await Brand.findOne({ name: name.trim() });
  if (existing) throw ApiError.conflict('A brand with this name already exists.');

  let logo;
  if (req.file) {
    logo = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);
  }

  const brand = await Brand.create({ name, description, isActive: isActive ?? true, ...(logo && { logo }) });

  return res.status(201).json(new ApiResponse(201, { brand }, 'Brand created successfully.'));
});

const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw ApiError.notFound('Brand not found.');

  const { name, description, isActive } = req.body;

  if (name && name.trim() !== brand.name) {
    const existing = await Brand.findOne({ name: name.trim(), _id: { $ne: brand._id } });
    if (existing) throw ApiError.conflict('A brand with this name already exists.');
    brand.name = name;
  }
  if (description !== undefined) brand.description = description;
  if (isActive !== undefined) brand.isActive = isActive;

  if (req.file) {
    const oldPublicId = brand.logo?.publicId;
    brand.logo = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);
    if (oldPublicId) await deleteFromCloudinary(oldPublicId);
  }

  await brand.save();

  return res.status(200).json(new ApiResponse(200, { brand }, 'Brand updated successfully.'));
});

const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw ApiError.notFound('Brand not found.');

  const productCount = await Product.countDocuments({ brand: brand._id });
  if (productCount > 0) {
    throw ApiError.badRequest(`Cannot delete this brand: ${productCount} product(s) still reference it.`);
  }

  if (brand.logo?.publicId) await deleteFromCloudinary(brand.logo.publicId);
  await brand.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Brand deleted successfully.'));
});

module.exports = { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
