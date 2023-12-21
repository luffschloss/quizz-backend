"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class clusters extends Model {
    static associate(models) {}
  }
  clusters.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.STRING(255),
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "clusters",
    }
  );
  return clusters;
};
