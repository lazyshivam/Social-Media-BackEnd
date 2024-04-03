const config = require('../config/config');
const jwt = require('jsonwebtoken');
const CONSTANT = require('../config/constant');
const { UserModel } = require('../models');

const userAuth = () => async (req, res, next) => {
  var bearerToken;
  console.log("here i am")
  var bearerHeader = req.headers["authorization"];
  //console.log("bearerHeader",bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    req.token = bearerToken;
    console.log("bearerToken", bearerToken);
    jwt.verify(bearerToken, config.jwt.secret, function (err, decoded) {
      (async () => {
        var details = await UserModel.findOne({ _id: decoded.sub });
      
        if (err) {
          console.log('Tokent err', err)
          return res.send({ code: CONSTANT.UNAUTHORIZED, message: 'Invalid Token!' });
        }
        if (!details) {
          console.log('User not found');
          // req.user = null;
          next();
        }
        req.user = details;
        next();
      })();
    });
  } else {
    return res.send({ code: CONSTANT.UNAUTHORIZED, message: CONSTANT.NO_TOKEN });
  }
};

module.exports = userAuth;
