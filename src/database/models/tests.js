"use strict";
const { Model } = require("sequelize");
const users = require("./users");
const subjects = require("./subjects");
const questions = require("./questions");
const test_detail = require("./test_details");
module.exports = (sequelize, DataTypes) => {
  class tests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  tests.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(255),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      easy_question: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      medium_question: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      difficult_question: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      show_correct_answer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      show_mark: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      submit_when_switch_tab: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      subject_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
      },
      semester_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "semesters",
          key: "id",
        },
      },
      chapters: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      swap_question: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      swap_answer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      total_mark: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        values: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "tests",
    }
  );
  tests.associate = (models) => {
    tests.belongsTo(models.users, { as: "users" });
    tests.belongsTo(models.subjects, { as: "subjects" });
    tests.belongsToMany(models.questions, {
      through: models.test_details,
    });
    //tests.hasMany(test_details);
  };
  return tests;
};
