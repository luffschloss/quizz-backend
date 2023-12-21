const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers, logger } = require("../extension/helper");
const userClusterSubjectRepository = require("./user_cluster_subject.repository");
const clusterRepository = require("./cluster.repository");
const users = dbContext.users;

module.exports = {
  create: async (user) => {
    user.id = Helpers.generateUiid(8);
    user.age = 1;
    const userCreate = await users.create(user);
    return userCreate;
  },
  update: async (user) => {
    console.log("update user", user);
    return await user.save();
  },
  delete: async (id, adminId) => {
    const transact = users.sequelize.transaction();
    try {
      const adminClusterId = await users.sequelize.query(
        `SELECT id from clusters where user_id='${adminId}'`,
        { type: QueryTypes.SELECT }
      );
      if (adminClusterId.length === 0) {
        return null;
      } else {
        console.log(adminClusterId);
        const query = `UPDATE questions AS q SET cluster_id=${adminClusterId[0].id} 
          WHERE q.cluster_id=(SELECT id FROM clusters WHERE user_id = '${id}')`;
        await users.sequelize.query(query, { type: QueryTypes.UPDATE });
      }
      const delUserClusterSubject =
        await userClusterSubjectRepository.deleteByUserId(id);
      const delCluster = await clusterRepository.deleteByUserId(id);
      const result = await users.sequelize.query(
        `UPDATE users SET isDelete=1 WHERE id = '${id}'`,
        { type: QueryTypes.UPDATE }
      );
      return result;
    } catch (err) {
      logger.error(`error when delete user with id: ${id}. error: ${err}`);
      (await transact).rollback();
    }
  },
  getById: async (id) => {
    const user = await users.findByPk(id);
    return user;
  },
  getByEmail: async (email) => {
    const query = `SELECT * 
        FROM users as u
        WHERE u.email = '${email}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user[0];
  },
  getRoles: async (id) => {
    const query = `SELECT 
        r.id,
        r.name
        FROM users as u
        JOIN user_roles as ur ON u.id = ur.user_id
        JOIN roles as r ON ur.role_id = r.id
        WHERE u.id = '${id}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user;
  },
  getFirstAdmin: async () => {
    const query = `SELECT u.* FROM users as u
        JOIN user_roles as ur ON u.id = ur.user_id
        JOIN roles as r ON ur.role_id = r.id
        WHERE r.name='admin' LIMIT 1`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user[0];
  },
  getPemissions: async (role_id) => {
    const query = `SELECT 
        p.name
        FROM roles as r 
        JOIN role_permissions as rp ON r.id = rp.role_id
        JOIN permissions as p ON rp.permission_id = p.id
        WHERE r.id = '${role_id}'`;
    const user = await users.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return user;
  },
  getAll: async () => {
    const listUser = await users.findAll();
    return listUser;
  },
  getAllFilter: async (inputQuery) => {
    let query = `SELECT * FROM users as us 
    ${inputQuery};`;
    console.log("repo query", query);
    return await users.sequelize.query(query, { type: QueryTypes.SELECT });
  },
  getByType: async (type) => {
    const listUser = await users.findAll({
      where: { type: type.toUpperCase() },
    });
    return listUser;
  },
};
