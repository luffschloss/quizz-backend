"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subjects", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      credit: {
        type: Sequelize.SMALLINT(2),
        allowNull: false,
      },
      theoretical_lesson: {
        type: Sequelize.SMALLINT(5),
        allowNull: false,
      },
      pratical_lesson: {
        type: Sequelize.SMALLINT(5),
        allowNull: false,
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "departments",
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
    await queryInterface.dropTable("subjects");
  },
};
