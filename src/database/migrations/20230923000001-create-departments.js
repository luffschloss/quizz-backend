"use strict";

const { CONSTANTS } = require("../../shared/constant");
const user_roles = require("../models/user_roles");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("departments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        unique: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("departments");
  },
};
