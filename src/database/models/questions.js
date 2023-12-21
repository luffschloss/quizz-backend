"use strict";
const { Model } = require("sequelize");
const chapters = require("./chapters");
const tests = require("./tests");
const test_details = require("./test_details");
const { CONSTANTS } = require("../../shared/constant");
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questions.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      level: {
        type: DataTypes.ENUM(Object.values(CONSTANTS.QUESTION.LEVEL)),
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer_a: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      answer_b: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      answer_c: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      answer_d: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.ENUM(Object.values(CONSTANTS.QUESTION.ANSWER)),
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_admin_create: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      user_create: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      cluster_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clusters",
          key: "id",
        },
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        values: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "questions",
    }
  );
  questions.associate = (models) => {
    questions.belongsTo(models.chapters, { as: "chapters" });
    questions.belongsToMany(models.tests, {
      through: models.test_details,
    });
    //questions.hasMany(test_details);
  };
  return questions;
};
