
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const CONSTANT = require('../config/constant');
const { UserModel } = require('../models');

const userAuth = () => async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return res.status(CONSTANT.UNAUTHORIZED).json({ code: CONSTANT.UNAUTHORIZED, message: CONSTANT.NO_TOKEN });
    }

    const token = bearerHeader.split(" ")[1];

    if (!token) {
      return res.status(CONSTANT.UNAUTHORIZED).json({ code: CONSTANT.UNAUTHORIZED, message: "Invalid token" });
    }

    jwt.verify(token, config.jwt.secret, async (error, decoded) => {
      // if (err) {
      //   console.error('Token error:', err);
      //   return res.status(CONSTANT.UNAUTHORIZED).json({ code: CONSTANT.UNAUTHORIZED, message:"Invalid token" });
      // }

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(CONSTANT.UNAUTHORIZED).json ({ data: {}, code: CONSTANT.UNAUTHORIZED, message: "Time out. Please login again" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(CONSTANT.UNAUTHORIZED).json ({ data: {}, code: CONSTANT.UNAUTHORIZED, message: "Invalid token." });
      } 
     
      const userDetails = await UserModel.findById(decoded.sub);

      if (!userDetails) {
        console.error('User not found');
        return res.status(CONSTANT.UNAUTHORIZED).json({ code: CONSTANT.UNAUTHORIZED, message: CONSTANT.USER_NOT_FOUND });
      }

      req.user = userDetails;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(CONSTANT.INTERNAL_SERVER_ERROR).json({ code: CONSTANT.INTERNAL_SERVER_ERROR, message: "Internal server error" });
  }
};

module.exports = userAuth;
