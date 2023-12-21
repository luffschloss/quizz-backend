'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user_roles extends Model {
        static associate(models) {
            // associations can be defined here
        }
    }
    user_roles.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        },
        {
            timestamps: false,
            sequelize,
            modelName: 'user_roles',
        });
    return user_roles;
}