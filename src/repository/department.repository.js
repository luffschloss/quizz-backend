const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const chapterConverter = require("../service/converter/chapter.converter");
const departments = dbContext.departments;

module.exports = {
  getAll: async () => {
    const query = "SELECT * FROM departments";
    const data = await departments.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getById: async (id) => {
    const chapter = await departments.findByPk(id);
    return chapter.dataValues;
  },
  create: async (payload) => {
    const result = await departments.create(payload);
    return result;
  },
  update: async (payload) => {
    await payload.save();
    return payload;
  },
  delete: async (id) => {
    const result = await departments.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
};
