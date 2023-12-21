'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('test_schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      semester_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'semesters', key: 'id' }
      }
    });
    await queryInterface.addConstraint('test_schedules', {
      fields: ['date', 'name'], name: 'UK_TEST_SCHEDULES_DATE_BEGIN_TIME', type: 'unique'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('test_schedules');
  }
};