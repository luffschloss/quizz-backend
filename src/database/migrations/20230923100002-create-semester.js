'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('semesters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      semester: {
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      from_date: {
        type: Sequelize.DATE,
      },
      to_date: {
        type: Sequelize.DATE,
      }
    });
    await queryInterface.addConstraint('semesters', {
      fields: ['semester', 'year'],
      type: 'unique', name: 'UK_SEMESTERS_SEMESTER_YEAR'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('semesters');
  }
};