"use strict";
const { Model } = require("sequelize");
const subject = require("./subjects");
const questions = require("./questions");
module.exports = (sequelize, DataTypes) => {
  class assigns extends Model {
    static associate(models) {}
  }
  assigns.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      credit_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "credit_classes",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "assigns",
    }
  );
  return assigns;
};
