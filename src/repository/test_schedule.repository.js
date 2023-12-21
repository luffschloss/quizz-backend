const dbContext = require("../database/models/config/dbContext");
const { QueryTypes } = require("sequelize");
const test_schedules = dbContext.test_schedules;

module.exports = {
  create: async (test_schedule) => {
    const test_scheduleCreate = await test_schedules.create(test_schedule);
    return test_scheduleCreate;
  },
  update: async (test_schedule) => {
    const query = `SELECT count(*) as quantity FROM test_credit_classes as tc WHERE tc.test_schedule_id=${test_schedule.id};`;
    const canUpdate = await test_schedules.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    if (canUpdate[0]?.quantity > 0) throw new Error("can not update");
    await test_schedule.save();
    return test_schedule;
  },
  delete: async (id) => {
    const query = `SELECT count(*) as quantity FROM test_credit_classes as tc WHERE tc.test_schedule_id=${id}`;
    const isTestScheduleAssigned = await test_schedules.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    console.log("isTestScheduleAssigned", isTestScheduleAssigned);
    if (isTestScheduleAssigned[0]?.quantity === 0) {
      console.log("should delete here");
      return await test_schedules.destroy({
        where: {
          id: id,
        },
      });
    } else {
      throw new Error("delete test schedule failed");
    }
  },
  getById: async (id) => {
    const test_schedule = await test_schedules.findByPk(id);
    return test_schedule;
  },
  getAll: async () => {
    const query = `SELECT (SELECT count(*) FROM test_credit_classes AS tc WHERE tc.test_schedule_id = ts.id) as quantity, ts.*,se.semester as semester, CONCAT(se.year,' - ',se.year+1) as year
        FROM test_schedules as ts 
        INNER JOIN semesters as se ON ts.semester_id = se.id
        ORDER BY ts.date DESC;`;
    const listtest_schedule = await test_schedules.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listtest_schedule;
  },
};
