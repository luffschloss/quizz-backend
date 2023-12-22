const env = process.env;
module.exports = {
  HOST: "sql12.freesqldatabase.com",
  USER: "sql12672212",
  PASSWORD: "HMTl8itJ9R",
  DB: "sql12672212",
  dialect: env.DB_DIALECT || "mysql",

  pool: {
    min: env.DB_POOL_MIN || 0,
    max: env.DB_POOL_MAX || 5,
    acquire: env.DB_POOL_ACQUIRE || 30000,
    idle: env.DB_POOL_IDLE || 10000,
  },
};
