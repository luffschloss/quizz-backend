'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_schedules.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'semesters', key: 'id' }
    }
  }, {
    sequelize,
    uniqueKeys: {
      fields: ['date', 'name']
    },
    timestamps: false,
    modelName: 'test_schedules',
  });
  return test_schedules;
};