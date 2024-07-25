// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   title: {
//     type: String,
//   },
//   description: {
//     type: String,
//   },
//   price: {
//     type: Number,
//   },
//   discountingPercentage: {
//     type: Number,
//   },
//   rating: {
//     type: Number,
//   },
//   stock: {
//     type: Number,
//   },
//   brand: {
//     type: String,
//   },
//   category: {
//     type: String,
//   },
//   thumbnail: {
//     type: String,
//   },
//   images: {
//     type: [String],
//   },
// });

// const ProductModel = mongoose.model("products", productSchema);

// module.exports = ProductModel;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountingPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length >= 1; 
      },
      message: 'At least one image is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
