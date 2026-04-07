const express = require("express");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");
const {
    uploadCategoryImage,
    resizeCategoryImage,
} = require("../middlewares/uploadImage");
const { protect, allowedTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router
    .route("/")
    .get(getAllCategories)
    .post(
        protect,
        allowedTo("admin"),
        uploadCategoryImage,
        resizeCategoryImage,
        createCategory
    );

router
    .route("/:id")
    .get(getCategoryById)
    .put(
        protect,
        allowedTo("admin"),
        uploadCategoryImage,
        resizeCategoryImage,
        updateCategory
    )
    .patch(
        protect,
        allowedTo("admin"),
        uploadCategoryImage,
        resizeCategoryImage,
        updateCategory
    )
    .delete(protect, allowedTo("admin"), deleteCategory);

module.exports = router;
