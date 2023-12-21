const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const questions = dbContext.questions;
const roles = dbContext.roles;
const role_permissions = dbContext.role_permissions;
const users = dbContext.users;
const user_roles = dbContext.user_roles;
const permissions = dbContext.permissions;

module.exports = {
  /**/
  getFourTopInfo: async () => {
    const query = `
    SELECT (SELECT count(*) FROM questions) AS questions, 
    (SELECT count(*) FROM tests) AS tests, 
    (SELECT count(*) FROM users) AS users, 
    (SELECT count(*) FROM results) AS results;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return info[0] || {};
  },
  getFourTopUserInfo: async (id) => {
    const query = `
    SELECT 
      (SELECT count(*) FROM credit_class_details AS ccd
      INNER JOIN test_credit_classes AS tcc ON ccd.credit_class_id=tcc.credit_class_id
      WHERE ccd.user_id = '${id}') AS tests,
      (SELECT count(*) FROM credit_class_details AS ccd
      INNER JOIN test_credit_classes AS tcc ON ccd.credit_class_id=tcc.credit_class_id
      INNER JOIN test_schedules AS ts ON tcc.test_schedule_id = ts.id 
      WHERE ccd.user_id = '${id}' AND ts.date > '${Helpers.convertToDate(
      new Date()
    )}') AS current_test,
      (SELECT AVG(rs.mark) FROM results AS rs WHERE rs.user_id = '${id}') AS mark,
      (SELECT count(*) FROM results as rs WHERE rs.user_id = '${id}') AS results;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    console.log(info[0]);
    return info[0] || {};
  },
  getPieChartMark: async () => {
    const query = `SELECT 
        (SUM(CASE WHEN mark<1 THEN 1 ELSE 0 END)) AS under_one,
        (SUM(CASE WHEN mark BETWEEN 1 AND 4 THEN 1 ELSE 0 END)) AS one_four,
        (SUM(CASE WHEN mark BETWEEN 4 AND 6.5 THEN 1 ELSE 0 END)) AS four_six_point_five,
        (SUM(CASE WHEN mark BETWEEN 6.5 AND 8 THEN 1 ELSE 0 END)) AS six_point_five_eight,
        (SUM(CASE WHEN mark BETWEEN 8 AND 9 THEN 1 ELSE 0 END)) AS eight_nine,
        (SUM(CASE WHEN mark > 9 THEN 1 ELSE 0 END)) AS above_nine
        FROM results;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return info[0] || {};
  },
  getBarChartSemester: async () => {
    const query = `SELECT COUNT(rs.id) AS num, se.* FROM results AS rs 
    INNER JOIN test_credit_classes AS tc ON rs.test_credit_classes_id = tc.id
    INNER JOIN test_schedules AS ts ON tc.test_schedule_id = ts.id
    RIGHT JOIN (SELECT * FROM semesters ORDER BY id DESC LIMIT 10) AS se ON ts.semester_id = se.id
    group by se.id;`;
    const info = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return info || [];
  },
  getRoles: async () => {
    return await roles.sequelize.query(`SELECT * FROM roles`, {
      type: QueryTypes.SELECT,
    });
  },
  getPermissonByRole: (id) => {
    return role_permissions.sequelize.query(
      `SELECT rp.*, p.name as permission_name FROM role_permissions as rp 
    INNER JOIN permissions as p ON rp.permission_id = p.id  
    WHERE rp.role_id = '${id}'`,
      { type: QueryTypes.SELECT }
    );
  },
  getUserByRole: (id) => {
    return user_roles.sequelize.query(
      `SELECT ur.*, CONCAT(u.firstName,' ',u.lastName) as user_name, u.email as user_email FROM user_roles as ur 
    INNER JOIN users as u ON ur.user_id = u.id
    WHERE ur.role_id = '${id}'`,
      { type: QueryTypes.SELECT }
    );
  },
  deleteRolePermissions: async (id) => {
    role_permissions.sequelize.query(
      `DELETE FROM role_permissions WHERE id=${id}`,
      { type: QueryTypes.DELETE }
    );
  },
  deleteUserRoles: async (id) => {
    user_roles.sequelize.query(`DELETE FROM user_roles WHERE id=${id}`, {
      type: QueryTypes.DELETE,
    });
  },
  putRole: async (role) => {
    return role.save();
  },
  putPermission: async (permission) => {
    return permission.save();
  },
  getRole: async (id) => {
    return await roles.findByPk(id);
  },
  getPermission: async (id) => {
    return await permissions.findByPk(id);
  },
  addUserToRole: async (data) => {
    return await user_roles.sequelize.query(
      `INSERT INTO user_roles (id,user_id,role_id) 
    VALUES (0, '${data?.user_id}', '${data?.role_id}')`,
      { type: QueryTypes.INSERT }
    );
  },
};
