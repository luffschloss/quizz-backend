const credit_classRepository = require("../repository/credit_class.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const creditClassConverter = require("./converter/credit_class.converter");
const assignService = require("./assign.service");
const xlsx = require("xlsx");
const creditClassDetailService = require("../repository/credit_class_details.repository");
const fs = require("fs");
const userRepository = require("../repository/user.repository");
const { CONSTANTS } = require("../shared/constant");
const authService = require("./auth.service");

module.exports = {
  getAll: async () => {
    try {
      var data = await credit_classRepository.getAll();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all credit class failed!");
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
      var data;
      if (isAdmin) {
        data = await credit_classRepository.getAll();
      } else {
        data = await credit_classRepository.getAllByUserId(id);
      }
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all credit class failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getAllAssign: async (id) => {
    return await assignService.getByCreditClassId(id);
  },
  getOne: async (id) => {
    try {
      var data = await credit_classRepository.getById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`get credit class with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getGVByCreditClassId: async (id) => {
    try {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        await credit_classRepository.getGVByCreditClassId(id),
        null
      );
    } catch (err) {
      logger.error(`get credit class with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (credit_class) => {
    try {
      let data = await credit_classRepository.create(credit_class);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create credit class failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (credit_class) => {
    try {
      let credit_classModel = await credit_classRepository.getById(
        credit_class.id
      );
      if (!credit_classModel) {
        throw new Error("Lớp tín chỉ không tồn tại");
      }
      creditClassConverter.convertDataToModel(credit_classModel, credit_class);
      var data = await credit_classRepository.update(credit_classModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update credit_class failed`);
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
      let credit_classModel = await credit_classRepository.getById(id);
      if (!credit_classModel) {
        throw new Error("Lớp tín chỉ không tồn tại");
      }
      var data = await credit_classRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete credit class with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  import: async (file, creditClassId) => {
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
        let total = jsonData.length;
        let successQ = 0,
          failedQ = 0;
        for (let row of jsonData) {
          console.log("row bang: ", row);
          try {
            const user = await userRepository.getByEmail(row.email);
            if (user.type === CONSTANTS.USER.TYPE.GV) {
              throw new Error("user is GV");
            }
            await creditClassDetailService.createUserClass({
              id: 0,
              user_id: user.id,
              credit_class_id: creditClassId,
              is_ban: false,
              group: null,
            });
            successQ++;
          } catch (err) {
            failedQ++;
          }
        }

        let resWorkBook = xlsx.utils.book_new();
        let sheetName = "Kết quả import";
        const resSheet = xlsx.utils.aoa_to_sheet([
          ["Kết quả import người dùng vào lớp tín chỉ", ""],
          ["Thời gian", new Date().toString()],
          ["Tổng số tài khoản được import", total],
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
};
