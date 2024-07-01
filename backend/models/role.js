"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            this.hasMany(models.User, { foreignKey: "roleId", as: "users" });
        }
    }
    Role.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Role",
            tableName: "roles"
        }
    );
    return Role;
};