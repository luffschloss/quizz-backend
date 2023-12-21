"use strict";

const { CONSTANTS } = require("../../shared/constant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      level: {
        type: Sequelize.ENUM(Object.values(CONSTANTS.QUESTION.LEVEL)),
        allowNull: false,
      },
      answer_a: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      answer_b: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      answer_c: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      answer_d: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      correct_answer: {
        type: Sequelize.ENUM(Object.values(CONSTANTS.QUESTION.ANSWER)),
        allowNull: false,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "chapters",
          key: "id",
        },
      },
      is_admin_create: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      user_create: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      cluster_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clusters",
          key: "id",
        },
      },
      isDelete: {
        type: Sequelize.BOOLEAN,
        values: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("questions");
  },
};
