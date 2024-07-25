const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

const signup = async (req, res) => {
  try {
    // Validate input data
    const { email, mobileNo, password, firstName, lastName, address } =
      req.body;

    // Validate required fields
    if (!email || !mobileNo || !password || !firstName || !address) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (email, mobileNo, password, firstName, address)",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Hasing Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // console.log("Plain tEXT pASSWORD", password);
    // console.log("Hashed Password", hashedPassword);

    //  user adding to DB
    const newlyInsertedUser = await UserModel.create({
      email,
      mobileNo,
      password: hashedPassword,
      firstName,
      lastName: lastName || "-",
      address,
      role: "CUSTOMER",
    });
    console.log(newlyInsertedUser._id);

    res.json({
      success: true,
      message: "Registration complelted, please login to continue",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to signup",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // Validate input data
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const isPasswordSame = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //  if passwords not matchs
    if (!isPasswordSame) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // token JWT
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const expiryTimeInSeconds = currentTimeInSeconds + 3600; // 1hr from now

    const jwtPayload = {
      userId: user._id,
      role: user.role,
      mobileNo: user.mobileNo,
      exp: expiryTimeInSeconds,
    };

    const token = jwt.sign(jwtPayload, "sercretkey");
    await UserModel.findByIdAndUpdate(user._id, { $set: { token } });
    res.json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

const userController = {
  signup,
  login,
};

module.exports = userController;
