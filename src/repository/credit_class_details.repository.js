const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const groupConverter = require("../service/converter/group.converter");
const credit_class_details = dbContext.credit_class_details;

module.exports = {
  /**/
  getUserClass: async (id) => {
    const query = `SELECT cc.*, users.firstName as first_name, users.lastName as last_name, users.code as user_code, users.email as user_email 
    FROM credit_class_details AS cc 
    INNER JOIN users ON cc.user_id = users.id
    WHERE cc.credit_class_id = ${id}`;
    const result = await credit_class_details.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  getListCreditClassOfUser: async (id) => {
    const query = `SELECT cc.credit_class_id
    FROM credit_class_details AS cc 
    INNER JOIN users ON cc.user_id = users.id
    WHERE cc.users_id = '${id}'`;
    const result = await credit_class_details.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  },
  createUserClass: async (userClass) => {
    const classCreate = await credit_class_details.create(userClass);
    return classCreate;
  },
  createListUserClass: async (data) => {
    const query = `INSERT INTO credit_class_details(user_id,credit_class_id,is_ban,credit_class_details.group) VALUES ${data}`;
    const result = await credit_class_details.sequelize.query(query, {
      type: QueryTypes.INSERT,
    });
    return result;
  },
  banUserClass: async () => {},
  deleteUserClass: async (id) => {
    return await credit_class_details.destroy({
      where: { id: id },
    });
  },
};
