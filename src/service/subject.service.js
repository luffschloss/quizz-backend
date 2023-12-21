const subjectRepository = require("../repository/subject.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const sendMailService = require("./common/sendmail.service");
const { Helpers, logger } = require("../extension/helper");
const subjectConverter = require("./converter/subject.converter");
const chapterRepository = require("../repository/chapter.repository");
const authService = require("./auth.service");
const questionService = require("./question.service");
const commonService = require("./common.service");
const userRepository = require("../repository/user.repository");

module.exports = {
  getAll: async () => {
    try {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        await subjectRepository.getAll(),
        null
      );
    } catch (err) {
      logger.error("get all subject failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getAllByUserId: async (id) => {
    try {
      const isAdmin = await authService.isAdmin(id);
      if (isAdmin) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await subjectRepository.getAll(),
          null
        );
      } else {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await subjectRepository.getAllByUserId(id),
          null
        );
      }
    } catch (err) {
      logger.error("get all subject failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getSubjectDropdownByUserId: async (id) => {
    try {
      const isAdmin = await authService.isAdmin(id);
      if (isAdmin) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await subjectRepository.getAll(),
          null
        );
      } else {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await subjectRepository.getSubjectDropdownByUserId(id),
          null
        );
      }
    } catch (err) {
      logger.error("get all subject failed!");
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
      var data = await subjectRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get subject with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (subject) => {
    try {
      let data = await subjectRepository.create(subject);
      //add  permission to subject for admin.
      const admin = await userRepository.getFirstAdmin();
      await commonService.createUserClusterSubject({
        subject_id: data.id,
        user_id: admin.id,
      });
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create subject failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (subject) => {
    try {
      let subjectModel = await subjectRepository.getEntityById(subject.id);
      if (!subjectModel) {
        throw new Error("Môn học không tồn tại");
      }
      subjectConverter.convertDataToModel(subjectModel, subject);
      var data = await subjectRepository.update(subjectModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update subject failed`);
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
      let subjectModel = await subjectRepository.getById(id);
      if (!subjectModel) {
        throw new Error("Môn học không tồn tại");
      }
      let chapters = await chapterRepository.getBySubjectId(id);
      if (chapters.length > 0) {
        throw new Error("Môn học đã có chương, không thể xóa");
      }
      var data = await subjectRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete subject with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
