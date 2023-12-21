const assignRepository = require("../repository/assign.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const sendMailService = require("./common/sendmail.service");
const { Helpers, logger } = require("../extension/helper");
const chapterConverter = require("./converter/chapter.converter");
const { pdfUtil } = require("../util/pdf/readPdfUtil");
const { CONSTANTS } = require("../shared/constant");
const questionRepository = require("../repository/question.repository");
const getString = (element) => {
  return element.toString().trim();
};
const getStringLower = (element) => {
  return element.toString().toLowerCase().trim();
};
const randomLevel = () => {
  const level = CONSTANTS.QUESTION.LEVEL;
  const levelList = [level.EASY, level.MEDIUM, level.DIFFICULT];
  return levelList[Math.floor(Math.random() * levelList.length)];
};
const randomCorrectAnswer = () => {
  const answer = CONSTANTS.QUESTION.ANSWER;
  const answerList = [
    answer.ANSWER_A,
    answer.ANSWER_B,
    answer.ANSWER_C,
    answer.ANSWER_D,
  ];
  return answerList[Math.floor(Math.random() * answerList.length)];
};
const randomChapterId = (chapterList) => {
  return chapterList[Math.floor(Math.random() * chapterList.length)];
};
module.exports = {
  import: async () => {
    const USER_ID = "11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23";
    const LIST_FILE = [
      {
        path: path.join(__dirname, "../../public/seed_data/pdf/CTDLGT.pdf"),
        chapterId: [6, 7, 8, 9, 10],
      },
      {
        path: path.join(__dirname, "../../public/seed_data/pdf/CSDL.pdf"),
        chapterId: [11, 12, 13, 14, 15],
      },
      {
        path: path.join(__dirname, "../../public/seed_data/pdf/OOP.pdf"),
        chapterId: [16, 17, 18, 19, 20],
      },
      {
        path: path.join(__dirname, "../../public/seed_data/pdf/python.pdf"),
        chapterId: [26, 27, 28, 29, 30],
      },
      {
        path: path.join(
          __dirname,
          "../../public/seed_data/pdf/LAPTRINHMANG.pdf"
        ),
        chapterId: [31, 32, 33, 34, 35],
      },
      {
        path: path.join(__dirname, "../../public/seed_data/pdf/CNPM.pdf"),
        chapterId: [36, 37, 38, 39],
      },
      {
        path: path.join(__dirname, "../../public/seed_data/pdf/MMT.pdf"),
        chapterId: [41, 42, 43, 44, 45],
      },
    ];
    for (let item of LIST_FILE) {
      const text = await pdfUtil.readPdf(item.path);
      let arr = text.split("\n").filter((i) => i.trim().length > 1);
      let cnt = 0;
      let q = "";
      let a = "",
        b = "",
        c = "",
        d = "";
      let query = "";
      //   for (let i = 0; i < 10; i++) {
      //     console.log(Helpers.generateUiid(8));
      //   }
      while (cnt < arr.length) {
        if (getStringLower(arr[cnt] || "")?.includes("câu")) {
          cnt++;
          while (
            !getStringLower(arr[cnt])?.includes("a.") &&
            cnt < arr.length
          ) {
            q += ` ${getString(arr[cnt] || "")}`;
            cnt++;
          }
          if (getStringLower(arr[cnt] || "")?.includes("a.")) {
            a = getString(arr[cnt].slice(2) || "");
            cnt++;
            while (!getStringLower(arr[cnt] || "")?.includes("b.")) {
              a += ` ${getString(arr[cnt] || "")}`;
              cnt++;
            }
          }
          if (getStringLower(arr[cnt] || "")?.includes("b.")) {
            b = getString(arr[cnt].slice(2) || "");
            cnt++;
            while (
              !getStringLower(arr[cnt] || "")?.includes("c.") &&
              cnt < arr.length
            ) {
              b += ` ${getString(arr[cnt] || "")}`;
              cnt++;
            }
          }
          if (getStringLower(arr[cnt] || "")?.includes("c.")) {
            c = getString(arr[cnt].slice(2) || "");
            cnt++;
            while (
              !getStringLower(arr[cnt] || "")?.includes("d.") &&
              cnt < arr.length
            ) {
              c += ` ${getString(arr[cnt] || "")}`;
              cnt++;
            }
          }
          if (getStringLower(arr[cnt] || "")?.includes("d.")) {
            d = getString(arr[cnt].slice(2) || "")
              .toString()
              .trim();
            cnt++;
            while (
              !getStringLower(arr[cnt] || "")?.includes("câu") &&
              cnt < arr.length
            ) {
              d += ` ${getString(arr[cnt] || "").toString()}`;
              cnt++;
            }
          }
          q = q.replace(/'/g, "");
          a = a.replace(/'/g, "");
          b = b.replace(/'/g, "");
          c = c.replace(/'/g, "");
          d = d.replace(/'/g, "");
          query += `('${q}', '${randomLevel()}','${a}','${b}','${c}','${d}','${randomCorrectAnswer()}', null, ${randomChapterId(
            item.chapterId
          )},1,'11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23', 1),`;
          q = "";
          a = "";
          b = "";
          c = "";
          d = "";
        } else {
          cnt++;
        }
      }
      query = query.slice(0, -1);
      await questionRepository.createMultiple(query);
    }
  },
};
