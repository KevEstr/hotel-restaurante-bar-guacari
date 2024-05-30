"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    class Agreement extends Model {
        static associate(models) {
            // Define association here
            this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            this.hasMany(models.Client, { foreignKey: "agreementId", as: "clients" });
        }
    }

    Agreement.init(
        {
            name: DataTypes.STRING,
            max_daily_food: DataTypes.INTEGER,
            max_daily_laundry: DataTypes.INTEGER,
            max_daily_hydration: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Agreement",
        }
    );
    return Agreement;
};
