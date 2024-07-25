/*
 * 1. Check if the items are in stock
 * 2. Calculate the total amount of the order
 * 3. Check mode of payment if COD, no change, if ONLINE,Then redirect the user to payment gatway
 * 4. If the Order total is above 1000, then do not allow the user to place COD Orders
 * 5. Place Order (Save details into DB)
 * 6. Send a order conformation email/ SMS
 * 7. Reduce inventory / Stock
 *
 * */
const ProductModel = require("../models/product");
const OrderModel = require("../models/order");

const placeOrder = async (req, res) => {
  const productIds = req.body.items.map((product) => product.product);
  const productsList = await ProductModel.find({ _id: productIds });
  // console.log(productsList);
  const areItemsInStock = req.body.items.every(
    (p) =>
      productsList.find((product) => product._id == p.product).stock > p.qty
  );
  // console.log(areItemsInStock);
  if (!areItemsInStock) {
    return res.status(400).json({
      success: false,
      message: "One or more ordered product(s) are out of stock",
    });
  }
  let totalAmountToPay = productsList.reduce((total, product) => {
    const productQty = req.body.items.find((p) => p.product == product._id).qty;
    return total + product.price * productQty;
  }, 0);
  // console.log(totalAmountToPay);
  if (totalAmountToPay < 500) {
    totalAmountToPay += 50;
  }

  if (req.body.modeOfPayment === "ONLINE") {
    // Redirect the user to payment Gatway
  }

  const orderDetails = {
    items: req.body.items,
    totalAmount: totalAmountToPay,
    deliveryAddress: req.body.deliveryAddress,
    billingAddress: req.body.deliveryAddress,
    modeOfPayment: req.body.modeOfPayment,
    orderStatus: "PENDING",
    user: req.user._id,
  };

  const { _id } = await OrderModel.create(orderDetails);

  req.body.items.forEach(async (product) => {
    await ProductModel.findByIdAndUpdate(product.product, {
      $inc: { stock: -product.qty },
    });
  });

  res.json({
    success: true,
    message: "Order placed SuccessFully",
    data: _id,
  });
};

const orderController = {
  placeOrder,
};

module.exports = orderController;
