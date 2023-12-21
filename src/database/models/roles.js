module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('roles', {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(127),
            unique: true,
            allowNull: false
        },
        normalizeName: {
            type: DataTypes.STRING(127),
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT('medium'),
            allowNull: true
        }
    });
    return role;
}