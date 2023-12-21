"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class results extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  results.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      test_credit_classes_id: {
        type: DataTypes.STRING(255),
        references: { model: "test_credit_classes", key: "id" },
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(255),
        references: { model: "users", key: "id" },
        allowNull: false,
      },
      mark: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
      },
      end_time: {
        type: DataTypes.DATE,
      },
      tab_switch: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "results",
    }
  );
  return results;
};
