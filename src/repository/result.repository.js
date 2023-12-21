const { QueryTypes, Sequelize } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const results = dbContext.results;
const result_details = dbContext.result_details;
const test_credit_classes = dbContext.test_credit_classes;
const resultDetailRepository = require("./result_detail.repository");
const { CONSTANTS } = require("../shared/constant");

module.exports = {
  getAll: async () => {
    const query = `SELECT tc.*, sm.id as semester_id, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, sj.name as subject_name,
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time, (SELECT count(*) FROM results as rs WHERE rs.test_credit_classes_id = tc.id) as result_count
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN subjects AS sj ON cc.subject_id = sj.id
      ORDER BY ts.date DESC, te.time DESC;`;
    return await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getAllFilter: async (filterQuery) => {
    let query = `SELECT tc.*, sm.id as semester_id, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, sj.name as subject_name,
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time, (SELECT count(*) FROM results as rs WHERE rs.test_credit_classes_id = tc.id) as result_count
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN subjects AS sj ON cc.subject_id = sj.id
      ${filterQuery}
      ORDER BY ts.date DESC, te.time DESC;`;
    return await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getAllFilterByUserId: async (filterQuery) => {
    const query = `SELECT tc.*, sm.id as semester_id, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, sj.name as subject_name,
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time, (SELECT count(*) FROM results as rs WHERE rs.test_credit_classes_id = tc.id) as result_count
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN subjects AS sj ON cc.subject_id = sj.id
      INNER JOIN assigns AS ass ON tc.credit_class_id = ass.credit_class_id
      ${filterQuery}
      ORDER BY ts.date DESC, te.time DESC;`;
    return await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getAllByUserId: async (id) => {
    const query = `SELECT tc.*, sm.id as semester_id, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, sj.name as subject_name,
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time, (SELECT count(*) FROM results as rs WHERE rs.test_credit_classes_id = tc.id) as result_count
      FROM test_credit_classes AS tc
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN subjects AS sj ON cc.subject_id = sj.id
      INNER JOIN assigns AS ass ON tc.credit_class_id = ass.credit_class_id
      WHERE ass.user_id = '${id}'
      ORDER BY ts.date DESC, te.time DESC;`;
    return await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getByTestClassId: async (id) => {
    const query = `SELECT rs.* 
        FROM results as rs INNER JOIN tests as t
        ON rs.test_id = t.id`;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  getAllResultByUserId: async (id) => {
    const query = `SELECT tc.*, rs.id as result_id,rs.user_id as user_id, CONCAT('Học kỳ ',sm.semester,', Năm học ',sm.year,' - ',sm.year + 1) as semester_name, 
    CONCAT(cc.class_code,' - ',cc.name) AS credit_class_name, ts.date AS test_schedule_date,  te.name as test_name,
    te.time as test_time
      FROM test_credit_classes AS tc
      INNER JOIN results AS rs ON rs.test_credit_classes_id = tc.id AND rs.user_id= '${id}'
      INNER JOIN tests AS te ON tc.test_id = te.id
      INNER JOIN credit_classes AS cc ON tc.credit_class_id = cc.id
      INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
      INNER JOIN semesters AS sm ON ts.semester_id = sm.id
      INNER JOIN credit_class_details as cd ON cc.id = cd.credit_class_id AND cd.user_id= '${id}'
      ORDER BY sm.year DESC, sm.semester DESC;`;
    const test_class = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return test_class;
  },
  getByTestCreditClassesId: async (id) => {
    const query = `SELECT rs.*, CONCAT(us.firstName,' ', us.lastName) as user_name,us.email as user_email, us.code as user_code 
    FROM results as rs
    INNER JOIN test_credit_classes as tc ON rs.test_credit_classes_id = tc.id
    INNER JOIN users as us on rs.user_id = us.id
    WHERE tc.id = ${id}`;
    const data = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getChartByTestCreditClassesId: async (id) => {
    const query = `SELECT marks.mark AS mark, count(*) AS quantity FROM results AS rs
    INNER JOIN (SELECT distinct mark from results) AS marks
    WHERE rs.mark = marks.mark AND rs.test_credit_classes_id=${id}
    GROUP BY marks.mark
    ORDER BY marks.mark ASC;`;
    const data = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getStatisticalByTestCreditClassesId: async (id) => {
    const query = `SELECT COUNT(*) AS total_test, 
    (SELECT COUNT(*) from results as rs
    INNER JOIN test_credit_classes as tc ON rs.test_credit_classes_id=tc.id
    INNER JOIN tests as t ON t.id = tc.test_id
    WHERE rs.test_credit_classes_id=${id} AND rs.mark > t.total_mark*0.4) AS above_avg_mark
    ,MAX(rs.mark) AS max_mark, MIN(rs.mark) AS min_mark, AVG(rs.mark) AS avg_mark
    FROM results AS rs
    WHERE rs.test_credit_classes_id=${id};`;
    const data = await test_credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getById: async (id) => {
    const query = `SELECT rs.*,te.total_mark AS total_mark from results AS rs
      INNER JOIN test_credit_classes AS tc ON rs.test_credit_classes_id = tc.id
      INNER JOIN tests AS te ON tc.test_id = te.id
      WHERE rs.id = ${id};`;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result[0];
  },
  getByTestId: async (id) => {
    const query = `SELECT rs.* 
        FROM results as rs INNER JOIN tests as t
        ON rs.test_id = t.id`;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  create: async (result) => {
    const resultCreate = await results.create(result);
    return resultCreate;
  },
  update: async (result) => {
    await result.save();
    return result;
  },
  delete: async (id) => {
    const details = await resultDetailRepository.getByResultId(id);
    if (details.length > 0) {
      await resultDetailRepository.deleteByResultId(id);
    }
    const result = await results.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },

  /**/
  getResultGroupById: async (id) => {
    const result = await result_groups.findByPk(id);
    return result;
  },
  createResultGroup: async () => {},
  updateResultGroup: async () => {},
  deleteResultGroup: async () => {},

  /**/
  getResultQuestionById: async (id) => {
    const result = await result_details.findByPk(id);
    return result;
  },
  getResultQuestionByResultId: async (id) => {
    const query = ``;
    const result = await results.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  createResultQuestion: async (resultQuestion) => {
    const result = await result_details.create(resultQuestion);
    return result;
  },
  createMultiResultQuestion: async (query) => {
    console.log(query);
    const exeQuery = `INSERT INTO result_details(result_id,question_id,position,choose) VALUES ${query};`;
    await result_details.sequelize.query(exeQuery, { type: QueryTypes.INSERT });
    return true;
  },
  updateResultQuestion: async (resultQuestion) => {
    const result = await result_details.update(resultQuestion);
    return result;
  },
  deleteResultQuestion: async (id) => {
    const result = await result_details.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
};
