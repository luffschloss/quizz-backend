const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { logger, Helpers } = require("../extension/helper");
const questions = dbContext.questions;

module.exports = {
  getAll: async () => {
    const query = `
    SELECT q.*,sj.id AS subject_id,sj.name AS subject_name, concat(u.firstName,' ',u.lastName) as user_name, 
      u.id AS user_id,u.email AS user_email, ch.id AS chapter_id,ch.name AS chapter_name 
      FROM questions AS q
      INNER JOIN chapters AS ch ON q.chapter_id = ch.id
      INNER JOIN subjects AS sj ON ch.subject_id = sj.id
      INNER JOIN clusters AS cl ON q.cluster_id = cl.id
      INNER JOIN users AS u ON cl.user_id = u.id
      WHERE q.isDelete <> true OR q.isDelete IS NULL
      ORDER BY id;`;
    const listquestion = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listquestion;
  },
  /**
   * get all question when user is not admin
   * @param {*} userId
   * @returns
   */
  getAllByUserId: async (userId) => {
    const query = `SELECT DISTINCT q.*,sj.id AS subject_id,sj.name AS subject_name, concat(u.firstName,' ',u.lastName) AS user_name, 
      u.id AS user_id,u.email AS user_email, ch.id AS chapter_id,ch.name AS chapter_name 
      FROM user_cluster_subjects AS ucs
      INNER JOIN questions AS q ON q.cluster_id = ucs.cluster_id
      INNER JOIN subjects AS sj ON ucs.subject_id = sj.id
      INNER JOIN chapters AS ch ON ch.id = q.chapter_id AND ch.subject_id = sj.id
      INNER JOIN clusters AS cl ON cl.id = ucs.cluster_id
      INNER JOIN users AS u ON u.id = cl.user_id
      WHERE ucs.user_id = '${userId}' AND (q.isDelete <> true OR q.isDelete IS NULL)
      ORDER BY id;`;
    const listquestion = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listquestion;
  },
  getFirstNum: async (num) => {
    const query = `SELECT questions.*, chapters.name as chapter_name, subjects.name as subject_name,subjects.id as subject_id 
        FROM questions, chapters, subjects 
        WHERE questions.chapter_id = chapters.id && chapters.subject_id = subjects.id LIMIT ${num}`;
    const listquestion = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listquestion;
  },
  getById: async (id) => {
    const query = `SELECT questions.*, subjects.id as subject_id 
        FROM questions, chapters, subjects 
        WHERE questions.chapter_id = chapters.id AND chapters.subject_id = subjects.id AND questions.id = ${id}`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question[0];
  },
  getByListId: async (ids) => {
    if (ids.length === 0) return [];
    const query = `SELECT questions.*, chapters.name as chapter_name
        FROM questions, chapters
        WHERE questions.chapter_id = chapters.id AND questions.id in (${ids})`;
    const data = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return data;
  },
  getBySubjectId: async (id) => {
    const query = `SELECT questions.*, chapters.name as chapter_name, subjects.name as subject_name,subjects.id as subject_id 
    FROM questions, subjects, chapters 
    WHERE questions.chapter_id = chapters.id AND chapters.subject_id = subjects.id AND chapters.subject_id = '${id}'`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question;
  },
  getByChapterId: async (ids) => {
    if (ids === 0) return [];
    const query = `SELECT questions.*, chapters.name as chapter_name 
    FROM questions, chapters 
    WHERE questions.chapter_id = chapters.id AND chapters.id in (${ids})`;
    const question = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return question;
  },
  findByPk: async (id) => {
    return await questions.findByPk(id);
  },
  create: async (question) => {
    const questionCreate = await questions.create(question);
    return questionCreate;
  },
  createMultiple: async (query) => {
    const queryExe = `INSERT INTO questions(question,level,answer_a,answer_b,answer_c,answer_d,correct_answer,image,chapter_id,is_admin_create,user_create, cluster_id)
    VALUES ${query}`;
    return await questions.sequelize.query(queryExe, {
      type: QueryTypes.INSERT,
    });
  },
  update: async (question) => {
    await question.save();
    return question;
  },
  delete: async (id) => {
    const result = await questions.destroy({
      where: {
        id: id,
      },
    });
    return result;
  },
  sortDelete: async (question) => {
    console.log(question, question.id);
    const transaction = await questions.sequelize.transaction();
    try {
      const questionEntity = await questions.findByPk(question.id);
      questionEntity.isDelete = true;
      const updateRes = await questionEntity.save();
      if (!updateRes) {
        throw new Error("Sort delete question failed");
      }
      let createQuestion = Helpers.cloneObject(question);
      createQuestion.id = 0;
      createQuestion.isDelete = false;
      const questionUpdate = await questions.create(createQuestion);
      await transaction.commit();
      return questionUpdate;
    } catch (err) {
      logger.error("update question error: " + err);
      transaction.rollback();
    }
  },
  canDelete: async (id) => {
    const query = `SELECT COUNT(*) as num FROM test_details as td WHERE td.question_id = ${id}`;
    const result = await questions.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result[0].num === 0;
  },
  updateWhenDeleteUserClusterSubject: async (
    adminClusterId,
    userClusterId,
    subjectId
  ) => {
    const query = `UPDATE questions as q 
          SET cluster_id=${adminClusterId} 
          WHERE q.cluster_id=${userClusterId}
          AND EXISTS (SELECT id FROM chapters as ch WHERE ch.id=q.chapter_id AND ch.subject_id='${subjectId}')`;
    return await questions.sequelize.query(query, { type: QueryTypes.UPDATE });
  },
};
