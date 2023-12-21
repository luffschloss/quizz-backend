'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('test_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'tests',
          key: 'id'
        }
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        }
      },
      order: {
        type: Sequelize.INTEGER(5)
      }
    });
    await queryInterface.addConstraint('test_details', {
      fields: ['test_id', 'question_id'],
      type: 'unique',
      name: 'UK_TEST_DETAILS_TEST_ID_QUESTION_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('test_details');
  }
};