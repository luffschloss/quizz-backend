const testRepository = require("../repository/test.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const testConverter = require("./converter/test.converter");
const questionService = require("./question.service");
const { CONSTANTS } = require("../shared/constant");
const fs = require("fs");
const findQuestionByLevel = (questions, level) => {
  const question = questions.find((item) => (item.level = level));
  questions = questions.filter((item) => item.id != question?.id);
  return question;
};
const PDFKit = require("pdfkit");
const path = require("path");
const subjectRepository = require("../repository/subject.repository");
const authService = require("./auth.service");
const { FILTER_CONST } = require("../shared/filter.constant");
module.exports = {
  getAll: async (id) => {
    try {
      const isAdmin = await authService.isAdmin(id);
      if (isAdmin) {
        var data = await testRepository.getAll();
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await testRepository.getAll(),
          null
        );
      } else {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await testRepository.getAllByUserId(id),
          null
        );
      }
    } catch (err) {
      logger.error("get all test failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getAllFilter: async (id, filterData) => {
    try {
      let queryArr = [];
      for (let item of Object.keys(filterData)) {
        if (filterData[item] && filterData[item].length > 0) {
          switch (item) {
            case FILTER_CONST.SEARCH:
              queryArr.push(
                `(sj.name LIKE '%${filterData[item]}%' OR t.name LIKE '%${filterData[item]}%')`
              );
              break;
            case FILTER_CONST.SUBJECT_ID:
              queryArr.push(`t.subject_id='${filterData[item]}'`);
              break;
            case FILTER_CONST.SEMESTER:
              queryArr.push(`sm.semester=${filterData[item]}`);
              break;
            case FILTER_CONST.YEAR:
              queryArr.push(`sm.year=${filterData[item]}`);
              break;
            default:
              break;
          }
        }
      }
      const query = queryArr.length > 0 ? `${queryArr.join(" AND ")}` : "";
      const isAdmin = await authService.isAdmin(id);
      if (isAdmin) {
        var data = await testRepository.getAll();
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await testRepository.getAllFilter(
            query.length > 0 ? ` WHERE ${query}` : ``
          ),
          null
        );
      } else {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await testRepository.getAllByUserIdFilter(
            id,
            query.length > 0 ? ` AND ${query}` : ``
          ),
          null
        );
      }
    } catch (err) {
      logger.error("get all test failed!");
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
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        await testRepository.getById(id),
        null
      );
    } catch (err) {
      logger.error(`get test with id "${id}" failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  create: async (test) => {
    try {
      //option ko auto create question
      if (!test.auto_generate_question) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          await testRepository.create(test),
          null
        );
      }
      //option con lai
      var questions = await questionService.getByChapterId(test.chapters);
      questions = questions.filter((item) =>
        test.chapters.includes(item.chapter_id)
      );
      const EASY_QUESTION = questions.filter(
        (q) => q.level === CONSTANTS.QUESTION.LEVEL.EASY
      );
      const MEDIUM_QUESTION = questions.filter(
        (q) => q.level === CONSTANTS.QUESTION.LEVEL.MEDIUM
      );
      const DIFFICULT_QUESTION = questions.filter(
        (q) => q.level === CONSTANTS.QUESTION.LEVEL.DIFFICULT
      );
      const EASY_QUESTION_COUNT = Number.parseInt(test.easy_question);
      const MEDIUM_QUESTION_COUNT = Number.parseInt(test.medium_question);
      const DIFFICULT_QUESTION_COUNT = Number.parseInt(test.difficult_question);
      if (EASY_QUESTION_COUNT > EASY_QUESTION.length) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Không đủ câu hỏi dễ"
        );
      }
      if (MEDIUM_QUESTION_COUNT > MEDIUM_QUESTION.length) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Không đủ câu hỏi vừa"
        );
      }
      if (DIFFICULT_QUESTION_COUNT > DIFFICULT_QUESTION.length) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Không đủ câu hỏi khó"
        );
      }
      console.log(test);
      console.log(questions);
      let data = await testRepository.create(test);
      let query = "";
      let orderCount = 1;
      const RANDOM_EASY = Helpers.getRandomItemsFromArray(
        EASY_QUESTION,
        EASY_QUESTION_COUNT
      );
      const RANDOM_MEDIUM = Helpers.getRandomItemsFromArray(
        MEDIUM_QUESTION,
        MEDIUM_QUESTION_COUNT
      );
      const RANDOM_DIFFICULT = Helpers.getRandomItemsFromArray(
        DIFFICULT_QUESTION,
        DIFFICULT_QUESTION_COUNT
      );
      for (let q of RANDOM_EASY) {
        query += `(0, '${data.id}', ${q.id}, ${orderCount}),`;
        orderCount++;
      }
      for (let q of RANDOM_MEDIUM) {
        query += `(0, '${data.id}', ${q.id}, ${orderCount}),`;
        orderCount++;
      }
      for (let q of RANDOM_DIFFICULT) {
        query += `(0, '${data.id}', ${q.id}, ${orderCount}),`;
        orderCount++;
      }
      query = query.slice(0, -1);
      console.log(query);
      const testDetails = await testRepository.createMultiTestQuestion(query);
      if (!testDetails) {
        //delete test here
      }
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create test failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  createManual: async (test, questions) => {
    try {
      const res = await testRepository.createTestManual(test, questions);
      if (res) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          res,
          ""
        );
      } else {
        return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, "");
      }
    } catch (err) {
      console.log(err);
      logger.error("create test manual failed");
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  update: async (test) => {
    try {
      let testModel = await testRepository.getById(test.id);
      if (!testModel) {
        throw new Error("Đề thi không tồn tại");
      }
      testConverter.convertDataToModel(testModel, test);
      var data = await testRepository.update(testModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update test failed`);
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
      let testModel = await testRepository.getById(id);
      if (!testModel) {
        throw new Error("Đề thi không tồn tại");
      }
      const testClass = await testRepository.getTestClassByTestId(id);
      if (testClass.length > 0) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "Đề thi đã được phân công, không thể xóa"
        );
      }
      var data = await testRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete test with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  /**/
  getTestClasses: async () => {
    try {
      let data = await testRepository.getTestClasses();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getTestClassesById: async (id) => {
    try {
      let data = await testRepository.getTestClassesById(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getTestClassByTestId: async (id, userId) => {
    try {
      let data;
      if (authService.isAdmin(userId)) {
        data = await testRepository.getTestClassByTestId(id);
      } else {
        data = await testRepository.getTestClassByTestId(id, userId);
      }
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getAllTestByUserId: async (id) => {
    try {
      let data = await testRepository.getAllTestByUserId(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  createTestClass: async (testGroup) => {
    try {
      let data = await testRepository.createTestClass(testGroup);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`create test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateTestClass: async (testClass) => {
    try {
      let data = await testRepository.createTestClass(testClass);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  deleteTestClass: async (id) => {
    try {
      let data = await testRepository.deleteTestClass(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete test group failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },

  /**/
  createTestQuestion: async (testQuestion) => {
    try {
      let data = await testRepository.createTestQuestion(testQuestion);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("create test detail failed");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateTestQuestion: async (testQuestion) => {
    try {
      let testModel = await testRepository.getTestQuestionById(testQuestion.id);
      if (!testModel) {
        throw new Error("Chi tiết đề thi không tồn tại");
      }
      testConverter.convertDataToModel(testModel, test);
      var data = await testRepository.update(testModel);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`update test question failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateTestDetail: async (questions, testId) => {
    try {
      let testQuestions = await testRepository.getTestQuestionByTestId(testId);
      const testQuestionIds = testQuestions.map((item) => item.question_id);
      if (questions?.sort().join(",") === testQuestionIds.sort().join(",")) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          true,
          null
        );
      }
      if (testQuestionIds.length > 0) {
        await testRepository.deleteListTestQuestion(
          `(${testQuestionIds.join(",")})`,
          testId
        );
      }
      console.log(testQuestions);
      const pushList = questions.map((item, index) => ({
        id: item,
        order: index + 1,
      }));
      console.log("pushList", pushList);
      await testRepository.createTestQuestion(pushList, testId);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        true,
        null
      );
    } catch (err) {
      logger.error(`update test question failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        false,
        err.message
      );
    }
  },
  deleteTestQuestion: async () => {
    try {
      let testModel = await testRepository.getTestQuestionById(id);
      if (!testModel) {
        throw new Error("Chi tiết đề thi không tồn tại");
      }
      var data = await testRepository.delete(id);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error(`delete test question with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  export: async (id) => {
    try {
      let test = await testRepository.getById(id);
      test = test.dataValues;
      let subject = await subjectRepository.getById(test.subject_id);
      console.log(subject);
      const doc = new PDFKit({
        margins: { top: 20, left: 20, bottom: 20, right: 20 },
      });
      const writeStream = fs.createWriteStream("test_export.pdf");

      // Write content to the PDF
      //doc.setEncoding("ascii");
      const lightFont = fs.readFileSync(
        path.join(__dirname, "../../public/fonts/BeVietnamPro-Light.ttf")
      );
      const regularFont = fs.readFileSync(
        path.join(__dirname, "../../public/fonts/BeVietnamPro-Regular.ttf")
      );
      const optionWidth = doc
        .fontSize(12)
        .widthOfString("HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG");
      doc.registerFont("lightFont", lightFont);
      doc.registerFont("regularFont", regularFont);
      doc.font("lightFont").fontSize(12);
      doc.text("HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG", {
        continued: true,
      });
      doc.text(test.name.toUpperCase(), { continued: false, align: "right" });
      doc.text("CƠ SỞ TẠI THÀNH PHỐ HỒ CHÍ MINH", {
        continued: true,
        indent: 60,
      });
      doc.text(`Thời gian thi: ${test.time} phút`, {
        continued: false,
        align: "right",
      });
      doc.text(`KHOA: ${subject?.department_name?.toUpperCase()}`);
      doc.text(`BỘ MÔN: ${subject?.name}`);
      //header

      doc.text("MSSV: ........................................", {
        continued: true,
      });
      doc.text(
        "Họ và tên: .........................................................................................."
      );
      doc.moveDown(1);
      doc.font("regularFont").text("Đề thi", { align: "center" });
      const questions = test.questions;
      for (let i = 0; i < questions.length; i++) {
        doc.fontSize(10);
        doc
          .font("regularFont")
          .text(`Câu ${i + 1}: `, { align: "left", continued: true });
        doc
          .font("lightFont")
          .text(`${questions[i].question}.`, { align: "left" });
        doc
          .font("regularFont")
          .text(`A.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_a}`);
        doc
          .font("regularFont")
          .text(`B.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_b}`);
        doc
          .font("regularFont")
          .text(`C.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_c}`);
        doc
          .font("regularFont")
          .text(`D.`, { continued: true })
          .font("lightFont")
          .text(`${questions[i].answer_d}`);
        doc.moveDown(1);
      }
      doc.fontSize(12).text("--HẾT--", { align: "center" });
      // Finalize the PDF
      const writeContent = new Promise((resolve, reject) => {
        writeStream.on("finish", (err, data) => {
          resolve(fs.readFileSync("test_export.pdf", { encoding: "base64" }));
        });
      });
      doc.pipe(writeStream);
      doc.end();

      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        //fs.readFileSync("test_export.pdf", { encoding: "base64" }),
        await writeContent,
        "export file success"
      );
    } catch (err) {
      logger.error(`failed to get test question with id ${id} failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
};
