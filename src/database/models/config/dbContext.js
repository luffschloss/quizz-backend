const permissions = require("../permissions");
const role_permissions = require("../role_permissions");
const roles = require("../roles");
const user_roles = require("../user_roles");
const users = require("../users");
const dbconfig = require("./dbconfig");
const config = require("./dbconfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbconfig.DB, dbconfig.USER, dbconfig.PASSWORD, {
  host: dbconfig.HOST,
  dialect: dbconfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbconfig.pool.max,
    min: dbconfig.pool.min,
    acquire: dbconfig.pool.acquire,
    idle: dbconfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.info("Connect to database successfully");
  })
  .catch((err) => {
    console.log("Connect to database failed. Error: ", err);
  });
/* DEFINE  DBCONTEXT */
const dbContext = {};

dbContext.Sequelize = Sequelize;
dbContext.sequelize = sequelize;

/* DEFINE MODELS */
dbContext.assigns = require("../assigns")(sequelize, DataTypes);
dbContext.users = require("../users")(sequelize, DataTypes);
dbContext.user_roles = require("../user_roles")(sequelize, DataTypes);
dbContext.roles = require("../roles")(sequelize, DataTypes);
dbContext.role_permissions = require("../role_permissions")(
  sequelize,
  DataTypes
);
dbContext.permissions = require("../permissions")(sequelize, DataTypes);
dbContext.questions = require("../questions")(sequelize, DataTypes);
dbContext.tests = require("../tests")(sequelize, DataTypes);
dbContext.subjects = require("../subjects")(sequelize, DataTypes);
dbContext.chapters = require("../chapters")(sequelize, DataTypes);
dbContext.credit_classes = require("../credit_classes")(sequelize, DataTypes);
dbContext.semesters = require("../semesters")(sequelize, DataTypes);
dbContext.test_schedules = require("../test_schedules")(sequelize, DataTypes);
dbContext.results = require("../results")(sequelize, DataTypes);
dbContext.result_details = require("../result_details")(sequelize, DataTypes);
dbContext.test_details = require("../test_details")(sequelize, DataTypes);
dbContext.departments = require("../departments")(sequelize, DataTypes);
dbContext.test_credit_classes = require("../test_credit_classes")(
  sequelize,
  DataTypes
);
dbContext.credit_class_details = require("../credit_class_details")(
  sequelize,
  DataTypes
);
dbContext.clusters = require("../clusters")(sequelize, DataTypes);
dbContext.user_cluster_subjects = require("../user_cluster_subjects")(
  sequelize,
  DataTypes
);

module.exports = dbContext;
