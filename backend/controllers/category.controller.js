const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");

const RESOURCE_NAME = "Category";

const isValidId = (id) => mongoose.isValidObjectId(id);

const throwNotFound = (resource = RESOURCE_NAME) => {
  const error = new Error(`${resource} not found`);
  error.statusCode = 404;
  throw error;
};

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate("doctors");
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    throwNotFound();
  }

  const category = await Category.findById(id).populate("doctors");

  if (!category) {
    throwNotFound();
  }

  res.status(200).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    throwNotFound();
  }

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("doctors");

  if (!category) {
    throwNotFound();
  }

  res.status(200).json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    throwNotFound();
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throwNotFound();
  }

  res.status(200).json({
    success: true,
    message: `${RESOURCE_NAME} deleted successfully`,
    data: category,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};