"use strict";

const { sequelize } = require("../models/config/dbContext");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("credit_class_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      credit_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "credit_classes", key: "id" },
      },
      is_ban: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      group: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
    await queryInterface.addConstraint("credit_class_details", {
      fields: ["user_id", "credit_class_id"],
      type: "unique",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("credit_class_details");
  },
};
