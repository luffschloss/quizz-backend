const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const results = require("../database/models/results");
const credit_classes = dbContext.credit_classes;

module.exports = {
  create: async (credit_class) => {
    const transaction = await credit_classes.sequelize.transaction();
    var credit_classCreate = {};
    try {
      const query = `COALESCE((SELECT cc.class_code FROM credit_classes AS cc ORDER BY class_code DESC LIMIT 1),'PTITHCM100000');
    SET @class_code =(CASE WHEN @class_code IS NOT NULL THEN CONCAT(SUBSTRING(@class_code, 1,4),CONVERT(((CONVERT(SUBSTRING(@class_code, 5), SIGNED)) + 1), CHAR))ELSE 'PTIT1001'END);
    INSERT INTO credit_classes(class_code, semester_id, subject_id, name, quantity) values(@class_code,${credit_class.semester_id},'${credit_class.subject_id}', '${credit_class.name}', ${credit_class.quantity});`;
      const newest_class_code = await credit_classes.sequelize.query(
        `SELECT (COALESCE((SELECT cc.class_code FROM credit_classes AS cc ORDER BY class_code DESC LIMIT 1),'LTC100000')) as class_code`,
        { type: QueryTypes.SELECT }
      );
      let tmp = newest_class_code[0].class_code;
      let new_class_code =
        tmp.substring(0, 3) + (Number.parseInt(tmp.slice(3)) + 1).toString();
      credit_classCreate = await credit_classes.sequelize.query(
        `INSERT INTO credit_classes(class_code, semester_id, subject_id, name, quantity) values('${new_class_code}',${credit_class.semester_id},'${credit_class.subject_id}', '${credit_class.name}', ${credit_class.quantity})`,
        { type: QueryTypes.INSERT }
      );
      await transaction.commit();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
    return credit_classCreate;
  },
  update: async (credit_class) => {
    await credit_class.save();
    return credit_class;
  },
  delete: async (id) => {
    const query = `DELETE FROM credit_classes as cc WHERE cc.id=${id}`;
    return await credit_classes.sequelize.query(query, {
      type: QueryTypes.DELETE,
    });
  },
  getById: async (id) => {
    const credit_class = await credit_classes.findByPk(id);
    return credit_class;
  },
  getAll: async () => {
    const query = `SELECT cc.*, sj.name as subject_name, sm.semester as semester_semester, CONCAT(sm.year,' - ', sm.year+1) as semester_year
    FROM credit_classes as cc,subjects as sj, semesters as sm 
    WHERE cc.subject_id = sj.id AND cc.semester_id = sm.id 
    ORDER BY sm.id DESC`;
    const listcredit_class = await credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listcredit_class;
  },
  getAllByUserId: async (id) => {
    const query = ` SELECT cc.*, sj.name as subject_name, sm.semester as semester_semester, CONCAT(sm.year,' - ', sm.year+1) as semester_year
    FROM credit_classes as cc
    INNER JOIN subjects as sj ON cc.subject_id = sj.id
    INNER JOIN semesters as sm ON cc.semester_id = sm.id
    INNER JOIN assigns AS ass on ass.credit_class_id = cc.id AND ass.user_id='${id}'
    ORDER BY sm.id DESC;`;
    return await credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  getGVByCreditClassId: async (id) => {
    const query = `SELECT DISTINCT us.* from credit_classes AS cc
    INNER JOIN user_cluster_subjects AS ucs ON ucs.subject_id = cc.subject_id
    INNER JOIN users AS us ON us.id = ucs.user_id
    INNER JOIN clusters AS cl ON cl.user_id = us.id AND ucs.cluster_id = cl.id
    WHERE  cc.id = ${id};`;
    return await credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },
  //lấy danh sách lớp tín chỉ kèm tất cả assign của lớp tín chỉ đấy (không sử dụng nữa)
  /*
  getAllAssign: async (id) => {
    const query = `SELECT cc.*, sj.name as subject_name, sm.semester as semester_semester, sm.year as semester_year
    FROM credit_classes as cc,subjects as sj, semesters as sm, assigns as asg
    WHERE cc.subject_id = sj.id AND cc.semester_id = sm.id and asg.credit_class_id = ${id}`;
    const listcredit_class = await credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listcredit_class;
  },
  */
};
