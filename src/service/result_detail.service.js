const resultDetailRepository = require("../repository/result_detail.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const resultDetailConverter = require("./converter/result_detail.converter");
const questionRepository = require("../repository/question.repository");

module.exports = {
  getAll: async () => {
    try {
      var data = await resultDetailRepository.getAll();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all resultDetail failed!");
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
      var data = await resultDetailRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get resultDetail with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getByResultId: async (id) => {
    try {
      const data = await resultDetailRepository.getByResultId(id);
      if (!data) data = [];
      const listQuestionId = data.map((item) => item.dataValues.question_id);
      const listAnswers = data.map((item) => ({
        question_id: item.dataValues.question_id,
        choose: item.dataValues.choose,
      }));
      let questions = await questionRepository.getByListId(
        listQuestionId.join(",")
      );
      questions = questions.map((q) => ({
        ...q,
        choose: listAnswers.find((ans) => ans.question_id == q.id).choose || "",
      }));
      return questions;
    } catch (err) {
      logger.error(`get result detail for result id ${id} failed`);
      throw new Error(`get result detail for result id ${id} failed`);
    }
  },
  create: async (resultDetail) => {
    try {
      let data = await resultDetailRepository.create(resultDetail);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create resultDetail failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (resultDetail) => {
    try {
      let resultDetailModel = await resultDetailRepository.getById(
        resultDetail.id
      );
      if (!resultDetailModel) {
        throw new Error("Chi tiết kết quả không tồn tại");
      }
      resultDetailConverter.convertDataToModel(resultDetailModel, resultDetail);
      var data = await resultDetailRepository.update(resultDetailModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update resultDetail failed`);
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
      var data = await resultDetailRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete resultDetail with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
