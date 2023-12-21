"use strict";
const { Model } = require("sequelize");
const subject = require("./subjects");
const questions = require("./questions");
module.exports = (sequelize, DataTypes) => {
  class chapters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chapters.init(
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
      index: {
        allowNull: false,
        type: DataTypes.INTEGER(2),
      },
      subject_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        values: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "chapters",
    }
  );
  // chapters.associate = (models) => {
  //   chapters.belongsTo(models.subjects, { as: 'subjects' });
  //   chapters.hasMany(models.questions, { as: 'questions' });
  // }
  return chapters;
};
