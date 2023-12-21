"use strict";
const { Model } = require("sequelize");
const chapter = require("./chapters");
const test = require("./tests");
module.exports = (sequelize, DataTypes) => {
  class subjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subjects.init(
    {
      id: { type: DataTypes.STRING(255), primaryKey: true },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      credit: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      theoretical_lesson: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
      },
      pratical_lesson: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "departments",
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
      modelName: "subjects",
    }
  );
  subjects.associate = (models) => {
    subjects.hasMany(models.chapters, { as: "chapters" });
    subjects.hasMany(models.tests, { as: "tests" });
  };
  return subjects;
};
