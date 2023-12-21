'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class question_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  question_request.init({
    question_id: DataTypes.INTEGER,
    message: DataTypes.STRING,
    approver_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'question_request',
  });
  return question_request;
};