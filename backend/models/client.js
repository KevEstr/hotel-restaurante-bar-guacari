"use strict";
const { Model } = require("sequelize");
const agreement = require("./agreement");
module.exports = (sequelize, DataTypes) => {
    class Client extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Order, {
                foreignKey: "clientId",
                as: "orders",
            });
            this.belongsTo(models.Agreement, { foreignKey: "agreementId", as: "agreement" });
        }
    }
    Client.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            dni: DataTypes.STRING,
            agreementId: DataTypes.INTEGER,
            has_reservation: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Client",
        }
    );
    return Client;
};
