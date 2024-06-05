"use strict";

const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
            this.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
        }
    }
    User.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            image: DataTypes.STRING,
            isAdmin: DataTypes.BOOLEAN,
            roleId: DataTypes.INTEGER, // Añadir el campo roleId

        },
        {
            sequelize,
            modelName: "User",
            hooks: {
                beforeCreate: (user) => {
                    const salt = bcrypt.genSaltSync(10);
                    user.password = bcrypt.hashSync(user.password, salt);
                },
            },
            defaultScope: {
                attributes: { exclude: ["password"] },
            },
            scopes: {
                withPassword: {
                    attributes: {},
                },
            },
        }
    );

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
};
