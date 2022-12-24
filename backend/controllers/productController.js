const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


// Create Prouct
const createProduct = async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !description) {
    throw new BadRequestError("Please fill in all fields");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      throw new BadRequestError("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
};

// Get all Products
const getProducts = async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(StatusCodes.OK).json(products);
};

// Get single product
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    throw new UnauthenticatedError("User not authorized");
  }
  res.status(200).json(product);
};

// Delete Product
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    throw new UnauthenticatedError("User not authorized");
  }
  await product.remove();
  res.status(200).json({ message: "Product deleted." });
};

// Update Product
const updateProduct = async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    throw new UnauthenticatedError("User not authorized");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      throw new BadRequestError("Image could not be uploaded, something went wrong!");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json(updatedProduct);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
