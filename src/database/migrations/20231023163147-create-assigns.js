"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("assigns", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      credit_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "credit_classes",
          key: "id",
        },
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    });
    queryInterface.addConstraint("assigns", {
      fields: ["credit_class_id", "user_id"],
      type: "unique",
      name: "UK_ASSIGN_USER_ID_CREDIT_CLASS_ID",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("assigns");
  },
};
