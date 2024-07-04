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
            this.belongsTo(models.Reservation, { foreignKey: "reservationId", as: "reservation" });

            Client.hasMany(models.Laundry, {
                foreignKey: "clientId",
                as: "laundries",
            });
            
        }
    }
    Client.init(
        {
            name: DataTypes.STRING,
            lastnames: DataTypes.STRING,
            phone: DataTypes.STRING,
            dni: DataTypes.STRING,
            agreementId: DataTypes.INTEGER,
            has_reservation: DataTypes.BOOLEAN,
            has_order: DataTypes.BOOLEAN,
            reservationId: DataTypes.INTEGER,
            is_active: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Client",
            tableName: "clients",
        }
    );
    return Client;
};
