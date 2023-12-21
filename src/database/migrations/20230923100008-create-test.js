"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tests", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
      },
      time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      easy_question: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      medium_question: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      difficult_question: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      show_correct_answer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      show_mark: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      submit_when_switch_tab: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      subject_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
      },
      semester_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "semesters",
          key: "id",
        },
      },
      chapters: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      swap_question: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      swap_answer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      total_mark: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      isDelete: {
        type: Sequelize.BOOLEAN,
        values: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tests");
  },
};
