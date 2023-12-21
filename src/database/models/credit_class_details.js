"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class credit_class_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  credit_class_details.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      credit_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "credit_classes", key: "id" },
      },
      is_ban: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      group: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "credit_class_details",
    }
  );
  return credit_class_details;
};
