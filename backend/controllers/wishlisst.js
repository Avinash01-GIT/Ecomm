const UserModel = require("../models/user");

const ProductModel = require("../models/product");

const addToWishList = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the catalog.",
      });
    }

    await UserModel.findByIdAndUpdate(req.user._id, {
      $push: { wishlist: req.body.productId },
    });

    res.json({
      success: true,
      message: "Added to wishlist successfully.",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const removeFromWishList = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.wishlist.includes(req.body.productId)) {
      return res.status(400).json({
        success: false,
        message: "Product not found in user's wishlist.",
      });
    }

    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: req.body.productId },
    });

    res.json({
      success: true,
      message: "Removed from wishlist successfully.",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    // Check if user exists
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Populate and retrieve wishlist
    const wishlist = await UserModel.findById(req.user._id)
      .populate("wishlist")
      .select("wishlist");

    // Check if wishlist is empty or not
    if (!wishlist || wishlist.wishlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Wishlist is empty.",
      });
    }

    res.json({
      success: true,
      message: "Get Wish List",
      results: wishlist,
    });
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


const wishlistController = {
  addToWishList,
  removeFromWishList,
  getWishlist,
};

module.exports = wishlistController;
