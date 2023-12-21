const { QueryTypes, Op } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const questionRepository = require("./question.repository");
const tests = dbContext.tests;
const test_details = dbContext.test_details;
const test_credit_classes = dbContext.test_credit_classes;
const questions = dbContext.questions;

module.exports = {
  getAll: async () => {
    const query = `SELECT t.*,(SELECT count(*) from test_details as td where td.test_id=t.id) as total_questions,
       sj.name as subject_name, sm.semester as semester_semester, CONCAT(sm.year,' - ',sm.year+1) as semester_year, sm.id AS semester_id
        FROM tests as t 
        INNER JOIN semesters as sm ON t.semester_id = sm.id
        INNER JOIN subjects as sj ON t.subject_id = sj.id
        ORDER BY sm.id DESC`;
    const res = await tests.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return res;
  },
  getAllByUserId: async (id) => {
    const query = `SELECT DISTINCT t.*,ass.user_id AS ass_user_id, (SELECT count(*) from test_details AS td where td.test_id=t.id) AS total_questions,
        sj.name AS subject_name, sm.semester AS semester_semester, CONCAT(sm.year,' - ',sm.year+1) AS semester_year, sm.id AS semester_id
        FROM tests AS t 
        LEFT JOIN test_credit_classes AS tcc ON t.id = tcc.test_id
        LEFT JOIN assigns AS ass ON ass.credit_class_id = tcc.credit_class_id
        INNER JOIN semesters as sm ON t.semester_id = sm.id
        INNER JOIN subjects as sj ON t.subject_id = sj.id
        WHERE ass.user_id='${id}'
        ORDER BY sm.id DESC;`;
    const res = await tests.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return res;
  },
  getAllFilter: async (inputQuery) => {
    const query = `SELECT t.*,(SELECT count(*) from test_details as td where td.test_id=t.id) as total_questions,
       sj.name as subject_name, sm.semester as semester_semester, CONCAT(sm.year,' - ',sm.year+1) as semester_year, sm.id AS semester_id
        FROM tests as t 
        INNER JOIN semesters as sm ON t.semester_id = sm.id
        INNER JOIN subjects as sj ON t.subject_id = sj.id 
        ${inputQuery}
        ORDER BY sm.id DESC`;
    const res = await tests.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return res;
  },
  getAllByUserIdFilter: async (id, inputQuery) => {
    const query = `SELECT DISTINCT t.*,ass.user_id AS ass_user_id, (SELECT count(*) from test_details AS td where td.test_id=t.id) AS total_questions,
        sj.name AS subject_name, sm.semester AS semester_semester, CONCAT(sm.year,' - ',sm.year+1) AS semester_year, sm.id AS semester_id
        FROM tests AS t 
        LEFT JOIN test_credit_classes AS tcc ON t.id = tcc.test_id
        LEFT JOIN assigns AS ass ON ass.credit_class_id = tcc.credit_class_id
        INNER JOIN semesters as sm ON t.semester_id = sm.id
        INNER JOIN subjects as sj ON t.subject_id = sj.id
        WHERE (t.user_id = '${id}' OR ass.user_id='${id}') ${inputQuery} 
        ORDER BY sm.id DESC;`;
    const res = await tests.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return res;
  },
  getById: async (id) => {
    var test = await tests.findByPk(id, {});
    var testDetails = await test_details.findAll({
      attributes: ["question_id"],
      where: { test_id: test?.id },
    });
    if (!testDetails) testDetails = [];
    testDetails = testDetails.map((item) => item.question_id);
    const questions = await questionRepository.getByListId(
      testDetails.join(",")
    );
    test.dataValues.questions = questions;
    return test;
  },
  create: async (test) => {
    test.id = Helpers.generateUiid(8);
    const testCreate = await tests.create(test);
    return testCreate;
  },
  update: async (test) => {
    await test.save();
    return test;
  },
  delete: async (id) => {
    const transaction = await tests.sequelize.transaction();
    try {
      const query = `DELETE FROM test_details as td WHERE td.test_id = '${id}'`;
      await tests.sequelize.query(query, { type: QueryTypes.DELETE });
      const res = await tests.destroy({
        where: {
          id: id,
        },
      });
      transaction.commit();
      return res;
    } catch (err) {
      transaction.rollback();
      return false;
    }
  },

  /**/
  getTestGroupById: async (id) => {
    const result = await test_credit_classes.findByPk(id);
    return result;
  },
  getTestClasses: async () => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      ORDER BY sm.year DESC, sm.semester DESC`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  getTestClassByTestId: async (id, userId) => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      ${
        userId
          ? `INNER JOIN assigns AS ass ON tc.credit_class_id = ass.credit_class_id AND ass.user_id='${userId}'`
          : ""
      }
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      WHERE tc.test_id = '${id}'
      ORDER BY sm.year DESC, sm.semester DESC`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  getTestClassesById: async (id) => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      WHERE tc.id = '${id}'
      ORDER BY sm.year DESC, sm.semester DESC`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  getAllTestByUserId: async (id) => {
    const query = `SELECT tc.*, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN credit_class_details as cd ON cc.id = cd.credit_class_id
      INNER JOIN users as us ON cd.user_id = us.id
      WHERE us.id = '${id}'
      ORDER BY sm.year DESC, sm.semester DESC;`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  getTestQuestionByTestId: async (id) => {
    const query = `SELECT * FROM test_details AS td WHERE td.test_id = '${id}';`;
    const res = await test_details.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return res;
  },
  createTestClass: async (testGroup) => {
    const result = await test_credit_classes.create(testGroup);
    return result;
  },
  updateTestClass: async (testGroup) => {
    const result = await test_credit_classes.update(testGroup);
    return result;
  },
  deleteTestClass: async (id) => {
    return await test_credit_classes.destroy({ where: { id: id } });
  },

  /**/
  getTestQuestionById: async (id) => {
    const result = await test_details.findByPk(id);
    return result;
  },
  createTestQuestion: async (testQuestion) => {
    const result = await test_details.create(testQuestion);
    return result;
  },
  createMultiTestQuestion: async (query) => {
    const exeQuery = `INSERT INTO test_details(id, test_id, question_id, test_details.order) VALUES ${query}`;
    return await test_details.sequelize.query(exeQuery, {
      type: QueryTypes.INSERT,
    });
  },
  createTestManual: async (test, questions) => {
    let query = [];
    const transaction = await tests.sequelize.transaction();
    try {
      test.id = Helpers.generateUiid(8);
      const res = await tests.create(test);
      for (let i = 0; i < questions.length; i++) {
        query.push(`(0, '${res.id}', ${questions[i]}, ${i + 1})`);
      }
      const exeQuery = `INSERT INTO test_details(id, test_id, question_id, test_details.order) VALUES ${query}`;
      await test_details.sequelize.query(exeQuery, {
        type: QueryTypes.INSERT,
      });
      transaction.commit();
      return res;
    } catch (err) {
      transaction.rollback();
      return false;
    }
  },
  updateTestQuestion: async (testQuestion) => {
    const result = await test_details.update(testQuestion);
    return result;
  },
  deleteTestQuestion: async (id) => {
    const result = await test_details.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
  createTestQuestion: async (questions, testId) => {
    const insertValue = questions
      .map((item) => `(${item.id}, '${testId}', ${item.order})`)
      .join(",");
    const query =
      "INSERT INTO test_details(`question_id`, `test_id`, `order`) VALUES " +
      `${insertValue};`;
    console.log(query);
    return await test_details.sequelize.query(query, {
      type: QueryTypes.INSERT,
    });
  },
  deleteListTestQuestion: async (str, testId) => {
    const query = `DELETE FROM test_details as td WHERE td.test_id='${testId}' AND td.question_id IN ${str}`;
    return await test_details.sequelize.query(query, {
      type: QueryTypes.DELETE,
    });
  },
};
