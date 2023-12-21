"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class test_credit_classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_credit_classes.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      test_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: { model: "tests", key: "id" },
      },
      credit_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "credit_classes", key: "id" },
      },
      test_schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "test_schedules", key: "id" },
      },
      test_time_count: {
        type: DataTypes.INTEGER,
      },
      is_notify: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      timestamps: false,
      uniqueKeys: {
        fields: ["test_id", "credit_class_id", "test_schedule_id"],
      },
      modelName: "test_credit_classes",
    }
  );
  return test_credit_classes;
};
