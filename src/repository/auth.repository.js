const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers, logger } = require("../extension/helper");
const userClusterSubjectRepository = require("./user_cluster_subject.repository");
const clusterRepository = require("./cluster.repository");
const users = dbContext.users;

module.exports = {
  isAdmin: async (id) => {
    const query = `SELECT count(*) as cnt FROM users as u
        JOIN user_roles as ur ON u.id = ur.user_id
        JOIN roles as r ON ur.role_id = r.id
        WHERE r.name='admin' AND u.id='${id}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user[0]?.cnt;
  },
};
