'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  role_permissions.init(
    {
      name: DataTypes.STRING(255),
      normalize: DataTypes.STRING(255),
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'role_permissions',
    }
  );
  return role_permissions;
};