const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authMiddleware = require("./middlewares/authMiddleware");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/order");
// Env Configuration
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// DB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB Connected Successfully!"))
  .catch((error) => console.log("Error Connecting DB", error));

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/order", authMiddleware, orderRoutes);

app.listen(10000, () => console.log(`Server is up and running at Port 10000`));
