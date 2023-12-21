"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("credit_classes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      semester_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "semesters", key: "id" },
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      subject_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: { model: "subjects", key: "id" },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("credit_classes");
  },
};
