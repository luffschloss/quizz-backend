const env = process.env;
module.exports = {
  HOST: env.DB_HOST || "localhost",
  USER: env.DB_USER || "root",
  PASSWORD: env.DB_PASSWORD || "root",
  DB: env.DB_DBNAME || "quizz",
  dialect: env.DB_DIALECT || "mysql",

  pool: {
    min: env.DB_POOL_MIN || 0,
    max: env.DB_POOL_MAX || 5,
    acquire: env.DB_POOL_ACQUIRE || 30000,
    idle: env.DB_POOL_IDLE || 10000,
  },
};
