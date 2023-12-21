const creditClassDetailRepository = require("../repository/credit_class_details.repository");
var jwt = require("jsonwebtoken");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const groupConverter = require("./converter/group.converter");

module.exports = {
  /* */
  createUserClass: async (user_class) => {
    try {
      let data = await creditClassDetailRepository.createUserClass(user_class);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create group failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  createListUserClass: async (data) => {
    try {
      var query = ``;
      data.users?.forEach((user) => {
        query += `('${user}',${data.credit_class_id},false, null),`;
      });
      query = query.slice(0, -1);
      let response = await creditClassDetailRepository.createListUserClass(
        query
      );
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        response,
        null
      );
    } catch (err) {
      logger.error("create group failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getListUserClass: async (id) => {
    try {
      let data = await creditClassDetailRepository.getUserClass(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create group failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  banUserGroup: async () => {},
  deleteUserClass: async (id) => {
    try {
      let data = await creditClassDetailRepository.deleteUserClass(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create group failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
