const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const clusters = dbContext.clusters;

module.exports = {
  getAll: async () => {
    const query = `SELECT cl.id as cluster_id, u.id, u.firstName, u.lastName,
    u.code, u.email, u.type, group_concat(sj.name) as subject_names FROM clusters as cl
    INNER JOIN users as u ON cl.user_id = u.id
    LEFT JOIN user_cluster_subjects as ucs ON u.id = ucs.user_id AND ucs.cluster_id=cl.id
    LEFT JOIN subjects AS sj ON sj.id = ucs.subject_id
    GROUP BY cl.id;`;
    const data = await clusters.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    console.log(data);
    return data;
  },
  getById: async (id) => {
    const res = await clusters.findByPk(id);
    return res;
  },
  getByUserId: async (id) => {
    const res = await clusters.findOne({
      where: { user_id: id },
    });
    return res;
  },
  create: async (data) => {
    const res = await clusters.create(data);
    return res;
  },
  update: async (data) => {
    await data.save();
    return data;
  },
  delete: async (id) => {
    const res = await clusters.destroy({
      where: {
        id: id,
      },
    });
    return res;
  },
  deleteByUserId: async (id) => {
    const res = await clusters.destroy({
      where: {
        user_id: id,
      },
    });
    return res;
  },
};
