'use strict';
const {
  Model
} = require('sequelize');
const test = require('./tests');
module.exports = (sequelize, DataTypes) => {
  class test_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_details.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    test_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'tests',
        key: 'id'
      }
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    timestamps: false,
    uniqueKeys: {
      field: ['test_id', 'question_id']
    },
    modelName: 'test_details',
  });
  return test_details;
};