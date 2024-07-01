"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Service extends Model {
        static associate(models) {
            this.belongsToMany(models.Agreement, { through: models.AgreementService, foreignKey: 'serviceId', as: 'agreement' });
            this.belongsToMany(models.Reservation, { through: models.ReservationService, foreignKey: 'serviceId', as: 'reservation' });

        }
    }
    Service.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Service",
            tableName: "services",
        }
    );
    return Service;
};
