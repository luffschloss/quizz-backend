const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { Helpers, logger } = require("../../extension/helper");
module.exports = {
  hashPassword: (plainText) => {
    if (typeof plainText === "string" && plainText.length > 0) {
      return cryptoJs.enc.Base64.stringify(cryptoJs.SHA256(plainText));
    }
    return false;
  },
  comparePassword: (plainText, hash) => {
    if (typeof plainText === "string" && plainText.length > 0) {
      return cryptoJs.enc.Base64.stringify(cryptoJs.SHA256(plainText)) === hash;
    }
    return false;
  },
  generateAccessToken: (id) => {
    return jwt.sign(
      {
        id: id,
      },
      process.env.SECRET_TOKEN_KEY,
      {
        expiresIn: process.env.ACCESS_EXPIRESIN,
      }
    );
  },
  generateRefreshToken: (id) => {
    return jwt.sign(
      {
        id: id,
      },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: process.env.REFRESH_EXPIRESIN,
      }
    );
  },
  generateResetPasswordToken: (id) => {
    return jwt.sign(
      {
        id: id,
      },
      process.env.RESET_PASSWORD_TOKEN_KEY,
      {
        expiresIn: process.env.RESET_PASSWORD_EXPIRESIN,
      }
    );
  },
  verifyToken: (token, secrect) => {
    const currentTime = new Date().getTime();
    if (token) {
      try {
        jwt.verify(token, secrect, (err, data) => {
          if (err) {
            throw new Error("Could not verify token");
          } else {
            if (data.exp * 1000 < currentTime) {
              throw new Error("Token expired");
            }
          }
        });
        return true;
      } catch (err) {
        logger.error("verify token failed");
        return false;
      }
    } else {
      return false;
    }
  },
  getUserIdFromJWTToken: (token, secrect) => {
    if (token) {
      try {
        const decode = jwt.verify(token, secrect);
        return decode.id;
      } catch (error) {
        logger.error("get userid from token failed");
        return error.message;
      }
    }
  },
  verifyTokenRefresh: async (req, res, next) => {
    const token = req.header("Authorization");
    if (token) {
      const refreshToken = token.split(" ")[1];
      console.log(refreshToken);
      try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, data) => {
          if (err) {
            console.log(err);
            return res
              .status(401)
              .json({ message: "Not authozation", isSuccess: false });
          }
          console.log("data : " + data);
          req.data = data;
        });
        next();
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Server is error", isSuccess: false });
      }
    } else {
      return res.status(400).json({ message: "No token", isSuccess: false });
    }
  },
};
