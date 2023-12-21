const chapterRepository = require("../repository/chapter.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const sendMailService = require("./common/sendmail.service");
const { Helpers, logger } = require("../extension/helper");
const chapterConverter = require("./converter/chapter.converter");
const commonService = require("./common.service");
const authService = require("./auth.service");

module.exports = {
  getAll: async (id) => {
    try {
      const isAdmin = await authService.isAdmin(id);
      if (isAdmin) {
        console.log("is admin", id);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await chapterRepository.getAll(),
          null
        );
      } else {
        console.log("not admin");
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await chapterRepository.getAllByUserId(id),
          null
        );
      }
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getBySubjectId: async (id) => {
    try {
      var data = await chapterRepository.getBySubjectId(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getOne: async (id) => {
    try {
      var data = await chapterRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get chapter with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (chapter) => {
    try {
      let data = await chapterRepository.create(chapter);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create chapter failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (chapter) => {
    try {
      let chapterModel = await chapterRepository.getById(chapter.id);
      if (!chapterModel) {
        throw new Error("Chương không tồn tại");
      }
      chapterConverter.convertDataToModel(chapterModel, chapter);
      var data = await chapterRepository.update(chapterModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update chapter failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  delete: async (id) => {
    try {
      let chapterModel = await chapterRepository.getById(id);
      if (!chapterModel) {
        throw new Error("Chương không tồn tại");
      }
      var data = await chapterRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete chapter with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
