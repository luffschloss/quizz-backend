const assignRepository = require("../repository/assign.repository");
var jwt = require("jsonwebtoken");
const { Helpers, logger } = require("../extension/helper");
const authRepository = require("../repository/auth.repository");

module.exports = {
  /**
   * check user is admin or not by id of user
   * @param {*} userId
   * @returns boolean
   */
  isAdmin: async (userId) => {
    try {
      return await authRepository.isAdmin(userId);
    } catch (err) {
      logger.error("check is admin of user failed!");
      console.log(err);
      return false;
    }
  },
};
