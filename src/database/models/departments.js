"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class departments extends Model {
    static associate(models) {
      // define association here
    }
  }
  departments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "departments",
    }
  );
  return departments;
};
