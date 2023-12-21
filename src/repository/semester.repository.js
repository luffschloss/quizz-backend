const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const semesterConverter = require("../service/converter/semester.converter");
const semesters = dbContext.semesters;

module.exports = {
  create: async (semester) => {
    const semesterCreate = await semesters.create(semester);
    return semesterCreate;
  },
  update: async (semester) => {
    await semester.save();
    return semester;
  },
  delete: async (id) => {
    const result = await semesters.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
  getById: async (id) => {
    const semester = await semesters.findByPk(id, {});
    return semester;
  },
  getAll: async (semester, year) => {
    let now = new Date().getTime();
    let query = "SELECT * FROM semesters as se";
    query += semester || year ? "WHERE " : "";
    if (semester || year) {
      query += semester ? `semester=${semester} AND ` : "";
      query += year ? `year=${year};` : "1";
    }
    query += " ORDER BY se.id DESC;";
    const listsemester = await semesters.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    console.log(new Date().getTime() - now);
    return listsemester;
  },
  getAllYear: async () => {
    const query = `SELECT DISTINCT year FROM semesters ORDER BY year DESC;`;
    return await semesters.sequelize.query(query, { type: QueryTypes.SELECT });
  },
  getAllSemester: async () => {
    const query = `SELECT DISTINCT semester FROM semesters ORDER BY semester DESC;`;
    return await semesters.sequelize.query(query, { type: QueryTypes.SELECT });
  },
};
