const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const chapterConverter = require("../service/converter/chapter.converter");
const chapters = dbContext.chapters;

module.exports = {
  getAll: async () => {
    const query =
      "select chapters.*, subjects.name as subject_name from chapters, subjects where chapters.subject_id = subjects.id";
    const listchapter = await chapters.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listchapter;
  },
  getAllByUserId: async (id) => {
    const query = `SELECT DISTINCT ch.*, sj.name AS subject_name FROM user_cluster_subjects as ucs
    INNER JOIN subjects AS sj ON ucs.subject_id = sj.id
    INNER JOIN chapters AS ch ON ch.subject_id = sj.id
    WHERE ucs.user_id = '${id}';`;
    const res = await chapters.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return res;
  },
  getById: async (id) => {
    const chapter = await chapters.findByPk(id);
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
  create: async (chapter) => {
    const query =
      "INSERT INTO chapters(`name`,`index`,`subject_id`) VALUES('" +
      chapter.name +
      "', (SELECT(COALESCE((SELECT ch.index FROM chapters AS ch WHERE ch.subject_id = '" +
      chapter.subject_id +
      "' ORDER BY ch.index DESC LIMIT 1),0)) + 1), '" +
      chapter.subject_id +
      "')";
    const chapterCreate = await chapters.sequelize.query(query, {
      type: QueryTypes.INSERT,
    });
    return chapterCreate;
  },
  update: async (chapter) => {
    await chapter.save();
    return chapter;
  },
  delete: async (id) => {
    const result = await chapters.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
};
