"use strict";

const { CONSTANTS } = require("../../shared/constant");
const user_roles = require("../models/user_roles");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("clusters", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(255),
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
        unique: true,
      },
    });

    await queryInterface.createTable("user_cluster_subjects", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(255),
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      cluster_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "clusters",
          key: "id",
        },
        allowNull: false,
      },
      subject_id: {
        type: Sequelize.STRING(255),
        references: {
          model: "subjects",
          key: "id",
        },
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("user_cluster_subjects", {
      type: "unique",
      fields: ["subject_id", "user_id", "cluster_id"],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("clusters");
    await queryInterface.dropTable("user_cluster_subjects");
  },
};
