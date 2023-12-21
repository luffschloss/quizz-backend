"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("results", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      test_credit_classes_id: {
        type: Sequelize.INTEGER,
        references: { model: "test_credit_classes", key: "id" },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(255),
        references: { model: "users", key: "id" },
        allowNull: false,
      },
      mark: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE,
      },
      end_time: {
        type: Sequelize.DATE,
      },
      tab_switch: {
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint("results", {
      fields: ["test_credit_classes_id", "user_id"],
      type: "unique",
      name: "UK_RESULT_TESTCREDIT_CLASSES_ID_USER_ID",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("results");
  },
};
