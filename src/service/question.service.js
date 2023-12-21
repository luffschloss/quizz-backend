const questionRepository = require("../repository/question.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const questionConverter = require("./converter/question.converter");
const userService = require("./user.service");
const xlsx = require("xlsx");
const fs = require("fs");
const { json } = require("body-parser");
const testRepository = require("../repository/test.repository");
const authService = require("./auth.service");
const clusterRepository = require("../repository/cluster.repository");
const resultDetailRepository = require("../repository/result_detail.repository");

module.exports = {
  getAll: async (userId) => {
    try {
      const isAdmin = await authService.isAdmin(userId);
      if (isAdmin) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await questionRepository.getAll(),
          null
        );
      } else {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await questionRepository.getAllByUserId(userId),
          null
        );
      }
    } catch (err) {
      logger.error("get all question failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getBySubjectId: async (id) => {
    return await questionRepository.getBySubjectId(id);
  },
  getByChapterId: async (ids) => {
    return await questionRepository.getByChapterId(ids);
  },
  getOne: async (id) => {
    try {
      var data = await questionRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get question with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (question) => {
    try {
      const userId = question.userId;
      const user = await userService.getById(userId);
      if (!user) {
        logger.error(`question service - user with id ${userId} is undefined`);
      }
      const cluster = await clusterRepository.getByUserId(userId);
      const role = user.roles[0]?.name;
      console.log;
      if (role === CONFIG.ROLE.ADMIN) {
        question.is_admin_create = true;
      }
      question.user_create = userId;
      question.cluster_id = cluster.id;
      let data = await questionRepository.create(question);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create question failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (question) => {
    try {
      let questionModel = await questionRepository.findByPk(question.id);
      if (!questionModel) {
        throw new Error("Chương không tồn tại");
      }
      let isContainResult = await resultDetailRepository.getAllByQuestionId(
        question.id
      );
      console.log("isContainResult", isContainResult);
      questionConverter.convertDataToModel(questionModel, question);
      if (isContainResult.length > 0) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await questionRepository.sortDelete(questionModel),
          null
        );
      } else {
        var data = await questionRepository.update(questionModel);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          data,
          null
        );
      }
    } catch (err) {
      logger.error(`update question failed`);
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
      let questionModel = await questionRepository.getById(id);
      if (!questionModel) {
        throw new Error("Câu hỏi không tồn tại");
      }
      const canDelete = await questionRepository.canDelete(id);
      if (!canDelete) {
        throw new Error("Câu hỏi đã được sử dụng, không thể xóa");
      }
      var data = await questionRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete question with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  import: async (file) => {
    if (!file) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "Không có file nào được chọn"
      );
    } else {
      try {
        const workBook = xlsx.read(file.buffer, { type: "buffer" });
        const sheet = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheet];

        const jsonData = xlsx.utils.sheet_to_json(workSheet);
        console.log(jsonData);
        let total = jsonData.length;
        let successQ = 0,
          failedQ = 0;
        for (let row of jsonData) {
          try {
            await questionRepository.create({
              id: 0,
              question: row.question,
              level: row.level,
              correct_answer: row.correct_answer,
              answer_a: row.answer_a,
              answer_b: row.answer_b,
              answer_c: row.answer_c,
              answer_d: row.answer_d,
              image: null,
              chapter_id: row.chapter_id,
              cluster_id: 1,
            });
            successQ++;
          } catch (err) {
            failedQ++;
          }
        }

        let resWorkBook = xlsx.utils.book_new();
        let sheetName = "Kết quả import";
        const resSheet = xlsx.utils.aoa_to_sheet([
          ["Kết quả import câu hỏi", ""],
          ["Thời gian", new Date().toString()],
          ["Tổng câu hỏi", total],
          ["Thành công", successQ],
          ["Thất bại", failedQ],
        ]);
        xlsx.utils.book_append_sheet(resWorkBook, resSheet, sheetName);
        const exportFilePath = "question_import_result.xlsx";
        xlsx.writeFile(resWorkBook, exportFilePath);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          fs.readFileSync("question_import_result.xlsx", {
            encoding: "base64",
          }),
          "ok"
        );
      } catch (err) {
        logger.error(`import question failed`);
        console.log(err);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          err.message
        );
      }
    }
  },
  export: async () => {
    try {
      const q = await questionRepository.getFirstNum(10);
      let data = [];
      if (q) {
        data.push([...Object.keys(q[0])]);
      }
      for (let item of q) {
        data.push([...Object.values(item)]);
      }
      const workBook = xlsx.utils.book_new();
      const workSheet = xlsx.utils.aoa_to_sheet(data);
      xlsx.utils.book_append_sheet(workBook, workSheet, "Danh sách câu hỏi");
      //xlsx.write(workBook, { type: "buffer", bookType: "xlsx" })
      xlsx.writeFile(workBook, "question_export.xlsx");
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        fs.readFileSync("question_export.xlsx", { encoding: "base64" }),
        "export success"
      );
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "export failed"
      );
    }
  },
};
