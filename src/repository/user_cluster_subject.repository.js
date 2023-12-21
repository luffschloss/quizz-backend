const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const clusterRepository = require("./cluster.repository");
const user_cluster_subjects = dbContext.user_cluster_subjects;

module.exports = {
  getAll: async () => {
    const query =
      "select chapters.*, subjects.name as subject_name from chapters, subjects where chapters.subject_id = subjects.id";
    const listchapter = await user_cluster_subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    console.log(listchapter);
    return listchapter;
  },
  getById: async (id) => {
    const chapter = await user_cluster_subjects.findByPk(id);
    return chapter;
  },
  getBySubjectId: async (id) => {
    const listchapter = await chapters.findAll({
      where: {
        subject_id: id,
      },
    });
    return listchapter;
  },
  getByUserId: async (id) => {
    const query = `SELECT tmp_table.*, u.email,u.firstName,u.lastName, u.code, u.type
    FROM users AS u INNER JOIN
     (SELECT sj.id as subject_id, sj.name as subject_name, cl.user_id, ucs.id as user_cluster_subject_id
        FROM user_cluster_subjects as ucs
        INNER JOIN clusters as cl ON cl.id=ucs.cluster_id
        INNER JOIN users as u ON ucs.user_id = u.id
        INNER JOIN subjects as sj ON sj.id = ucs.subject_id
        WHERE ucs.user_id='${id}') AS tmp_table
        ON tmp_table.user_id = u.id;`;
    return await user_cluster_subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getUsers: async () => {
    const query = `SELECT DISTINCT usc.user_id, CONCAT(u.firstName,' ',u.lastName) AS user_name, u.email 
    FROM user_cluster_subjects AS usc  
    INNER JOIN users AS u ON usc.user_id=u.id;`;
    return await user_cluster_subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  /**
   * Get all subject of user in table user_cluster_subject
   * @Param  {string} id - userId
   */
  getSubjectByUserId: async (id) => {
    const query = `SELECT DISTINCT usc.subject_id, sj.name as subject_name
    FROM user_cluster_subjects AS usc
    INNER JOIN subjects AS sj ON usc.subject_id = sj.id
    INNER JOIN clusters as cl ON usc.cluster_id = cl.id
    WHERE usc.user_id='${id}' AND cl.user_id='${id}'`;
    return await user_cluster_subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  /**
   *
   * @param {*} id - userId
   * @returns
   */
  getUCSByUserId: async (id) => {
    const query = `SELECT DISTINCT usc.subject_id, cl.user_id as user_cluster_id
    FROM user_cluster_subjects AS usc
    INNER JOIN clusters AS cl ON cl.id=usc.cluster_id
    WHERE usc.user_id='${id}'`;
    return await user_cluster_subjects.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  //kiểm tra xem cluster với userid và môn học tương ứng có trong table chưa. nếu chưa thì ko cho thêm.
  checkCanCreate: async (clusterId, subjectId) => {
    const query = `SELECT * FROM user_cluster_subjects WHERE 
    cluster_id = ${data.cluster_id} AND subject_id='${data.subject_id}' AND user_id=
    (SELECT user_id FROM clusters WHERE id = ${data.cluster_id})`;
    return (
      (
        await user_cluster_subjects.sequelize.query(query, {
          type: QueryTypes.SELECT,
        })
      ).length > 0
    );
  },
  create: async (data) => {
    const cluster = await clusterRepository.getById(data.cluster_id);
    if (cluster.dataValues.user_id === data.user_id) {
      return await user_cluster_subjects.create(data);
    }
    const query = `SELECT * FROM user_cluster_subjects WHERE 
    cluster_id = ${data.cluster_id} AND subject_id='${data.subject_id}' AND user_id=
    (SELECT user_id FROM clusters WHERE id = ${data.cluster_id})`;
    const canCreate =
      (
        await user_cluster_subjects.sequelize.query(query, {
          type: QueryTypes.SELECT,
        })
      ).length > 0;
    if (!canCreate)
      throw new Error("Không có câu hỏi nào thuộc bộ câu hỏi này.");
    return await user_cluster_subjects.create(data);
  },
  delete: async (id) => {
    return await user_cluster_subjects.destroy({
      where: {
        id: id,
      },
    });
  },
  deleteByClusterIdAndSubjectId: async (cluster_id, subject_id) => {
    return await user_cluster_subjects.destroy({
      where: {
        cluster_id: cluster_id,
        subject_id: subject_id,
      },
    });
  },
  deleteByUserId: async (id) => {
    const res = await user_cluster_subjects.destroy({
      where: {
        user_id: id,
      },
    });
    return res;
  },
};
