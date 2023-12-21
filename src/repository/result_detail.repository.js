const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const result_details = dbContext.result_details;

module.exports = {
  getAll: async () => {
    const list_result_detail = await result_details.findAll();
    return list_result_detail;
  },
  getById: async (id) => {
    const result_detail = await result_details.findByPk(id);
    return result_detail;
  },
  getByResultId: async (id) => {
    return await result_details.findAll({
      where: {
        result_id: id,
      },
    });
  },
  getAllByQuestionId: async (id) => {
    return await result_details.findAll({
      where: {
        question_id: id,
      },
    });
  },
  create: async (result_detail) => {
    const result_detailCreate = await result_details.create(result_detail);
    return result_detailCreate;
  },
  update: async (result_detail) => {
    await result_detail.save();
    return result_detail;
  },
  delete: async (id) => {
    const result = await result_details.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
  deleteByResultId: async () => {
    const query = `DELETE FROM result_details WHERE result_id = ${id};`;
    return await result_details.sequelize.query(query, {
      type: QueryTypes.DELETE,
    });
  },
};
