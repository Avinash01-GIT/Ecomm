const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

// token validation
/*
  1. if the token is present in request
  2. check if the token is vaild (Validate the generating source)
  3. if the token is expired
  4. user details validation
*/

const authMiddleware = async (req, res, next) => {
  try {
    const bearertoken = req.headers.authorization;
    if (!bearertoken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = bearertoken.split(" ")[1];
    const isVerified = jwt.verify(token, "sercretkey");
    const tokenData = jwt.decode(token);
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);

    if (currentTimeInSeconds > tokenData.exp) {
      // Token is Expired
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const isValidUser = await UserModel.findOne({ token: token });
    if (!isValidUser) {
      return res.status(401).json({
        success: false,
        message: "Please login to use this API",
      });
    }
    req.user = isValidUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
