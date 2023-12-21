"use strict";
const { Model } = require("sequelize");
const subject = require("./subjects");
const questions = require("./questions");
module.exports = (sequelize, DataTypes) => {
  class user_cluster_subjects extends Model {
    static associate(models) {}
  }
  user_cluster_subjects.init(
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
        allowNull: false,
      },
      cluster_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "clusters",
          key: "id",
        },
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.STRING(255),
        references: {
          model: "subjects",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "user_cluster_subjects",
    }
  );
  return user_cluster_subjects;
};
