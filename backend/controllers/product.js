const ProductModel = require("../models/product");

const listProducts = async (req, res) => {
  const pageSize = req.query.pageSize;
  const pageNo = req.query.pageNo;
  const minPrice = req.query.minPrice || 0;
  const sortBy = req.query.sort === "ASC" ? 1 : -1;
  const productList = await ProductModel.find({
    price: {
      $gte: minPrice,
    },
    isActive: true,
  })
    .sort({ price: sortBy })
    .limit(pageSize)
    .skip((pageNo - 1) * pageSize);
  res.json({
    success: true,
    results: productList,
  });
};

const createProduct = async (req, res) => {
  try {
    const { error } = ProductModel.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }
    // Create new product
    const newlyInsertedProduct = await ProductModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newlyInsertedProduct._id,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editProduct = async (req, res) => {
  const productId = req.params.productId;
  await ProductModel.findByIdAndUpdate(productId, { $set: req.body });
  res.json({
    success: true,
    message: "Edit Product API",
  });
};

const deleteProduct = async (req, res) => {
  // await ProductModel.findByIdAndDelete(req.params.productId);
  const productId = req.params.productId;
  await ProductModel.findByIdAndUpdate(productId, {
    $set: { isActive: false },
  });
  res.json({
    success: true,
    message: "Delete Product API",
  });
};

const productControllers = {
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
};

module.exports = productControllers;
