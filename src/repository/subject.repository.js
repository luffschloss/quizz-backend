const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const subjectConverter = require("../service/converter/subject.converter");
const subjects = dbContext.subjects;
const { QueryTypes } = require("sequelize");

module.exports = {
  create: async (subject) => {
    subject.id = Helpers.generateUiid(8);
    const subjectCreate = await subjects.create(subject);
    return subjectCreate;
  },
  update: async (subject) => {
    return await subject.save();
  },
  delete: async (id) => {
    const query = `DELETE FROM subjects WHERE id = '${id}'`;
    const result = await subjects.sequelize.query(query, {
      type: QueryTypes.DELETE,
    });
    return result;
  },
  getById: async (id) => {
    const query = `SELECT sj.*,dp.name as department_name FROM subjects AS sj  
      INNER JOIN departments AS dp
      ON sj.department_id = dp.id
      WHERE sj.id='${id}';
    `;
    const subject = await subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return subject[0];
  },
  getEntityById: async (id) => {
    return await subjects.findByPk(id);
  },
  getAll: async () => {
    const query = `SELECT sj.*, dp.name as department_name FROM subjects as sj
        INNER JOIN departments as dp ON sj.department_id = dp.id
        ORDER BY sj.department_id ASC, sj.name ASC;`;
    const listsubject = await subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listsubject;
  },
  getAllByUserId: async (id) => {
    const query = `SELECT sj.*, dp.name AS department_name FROM user_cluster_subjects as ucs
      INNER JOIN subjects AS sj ON ucs.subject_id = sj.id
      INNER JOIN clusters AS cl ON cl.id = ucs.cluster_id AND cl.user_id = ucs.user_id
      INNER JOIN departments as dp ON sj.department_id = dp.id
      WHERE ucs.user_id = '${id}' 
      ORDER BY sj.department_id ASC, sj.name ASC;`;
    return await subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  //Lấy tất cả môn học bao gồm cả môn học chỉ đc quyền xem
  getSubjectDropdownByUserId: async (id) => {
    const query = `SELECT DISTINCT sj.*, dp.name AS department_name FROM user_cluster_subjects as ucs
      INNER JOIN subjects AS sj ON ucs.subject_id = sj.id
      INNER JOIN clusters AS cl ON cl.id = ucs.cluster_id
      INNER JOIN departments as dp ON sj.department_id = dp.id
      WHERE ucs.user_id = '${id}' ORDER BY sj.name ASC;`;
    return await subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
};
