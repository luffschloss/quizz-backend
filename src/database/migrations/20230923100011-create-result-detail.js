"use strict";

const { CONSTANTS } = require("../../shared/constant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("result_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      result_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "results",
          key: "id",
        },
        allowNull: false,
      },
      question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "questions",
          key: "id",
        },
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
      },
      choose: {
        type: Sequelize.ENUM(Object.values(CONSTANTS.QUESTION.ANSWER)),
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("result_details");
  },
};
