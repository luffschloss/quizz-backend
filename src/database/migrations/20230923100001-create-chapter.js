"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chapters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      index: {
        allowNull: false,
        type: Sequelize.INTEGER(2),
      },
      subject_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isDelete: {
        type: Sequelize.BOOLEAN,
        values: false,
      },
    });
    await queryInterface.addConstraint("chapters", {
      fields: ["subject_id", "index"],
      type: "unique",
      name: "UK_CHAPTERS_SUBJECT_ID_INDEX",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("chapters");
  },
};
