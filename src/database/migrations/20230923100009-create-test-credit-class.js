"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("test_credit_classes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      test_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: { model: "tests", key: "id" },
      },
      credit_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "credit_classes", key: "id" },
      },
      test_schedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "test_schedules", key: "id" },
      },
      test_time_count: {
        type: Sequelize.INTEGER,
      },
      is_notify: {
        type: Sequelize.BOOLEAN,
      },
    });
    await queryInterface.addConstraint("test_credit_classes", {
      fields: ["test_id", "credit_class_id", "test_schedule_id"],
      type: "unique",
      name: "UK_TEST_CREDIT_CLASSES_TEST_ID_GROUP_ID_TEST_SCHEDULE_ID",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("test_credit_classes");
  },
};
