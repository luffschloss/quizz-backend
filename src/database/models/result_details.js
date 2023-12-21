"use strict";
const { Model } = require("sequelize");
const { CONSTANTS } = require("../../shared/constant");
module.exports = (sequelize, DataTypes) => {
  class result_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  result_details.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      result_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "results",
          key: "id",
        },
        allowNull: false,
      },
      question_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "questions",
          key: "id",
        },
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
      },
      choose: {
        type: DataTypes.ENUM(Object.values(CONSTANTS.QUESTION.ANSWER)),
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "result_details",
    }
  );
  return result_details;
};
