"use strict";

const { CONSTANTS } = require("../../shared/constant");
const user_roles = require("../models/user_roles");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("users", {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(255),
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.ENUM(Object.values(CONSTANTS.USER.GENDER)),
        allowNull: false,
        defaultValue: CONSTANTS.USER.GENDER.MALE,
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.BLOB("long"),
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(Object.values(CONSTANTS.USER.TYPE)),
        allowNull: false,
        defaultValue: CONSTANTS.USER.TYPE.SV,
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      oauthToken: {
        type: Sequelize.STRING,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      },
      isDelete: {
        type: Sequelize.BOOLEAN,
        values: false,
      },
    });
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(127),
        unique: true,
        allowNull: false,
      },
      normalizeName: {
        type: Sequelize.STRING(127),
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
      },
    });
    await queryInterface.createTable("user_roles", {
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
      },
      role_id: {
        type: Sequelize.STRING(255),
        references: {
          model: "roles",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("users", { cascade: true });
    queryInterface.dropTable("roles", { cascade: true });
    queryInterface.dropTable("user_roles", { cascade: true });
  },
};
