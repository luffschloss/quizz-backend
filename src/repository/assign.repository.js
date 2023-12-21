const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const assigns = dbContext.assigns;

module.exports = {
  getAll: async () => {
    const listassigns = await assigns.findAll();
    return listassigns;
  },
  getById: async (id) => {
    const assign = await assigns.findByPk(id);
    return assign;
  },
  getByUserId: async (id) => {
    const listassigns = await assigns.findAll({
      where: {
        user_id: id,
      },
    });
    return listassigns;
  },
  getByCreditClassId: async (id) => {
    const query = `SELECT asg.*, users.firstName as first_name, users.lastName as last_name, users.code as user_code 
    FROM assigns AS asg INNER JOIN users ON asg.user_id = users.id
    WHERE asg.credit_class_id = ${id}`;
    const listassigns = await assigns.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listassigns;
  },
  create: async (assign) => {
    const assignsCreate = await assigns.create(assign);
    return assignsCreate;
  },
  update: async (assign) => {
    await assign.save();
    return assign;
  },
  delete: async (id) => {
    const result = await assigns.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
};
