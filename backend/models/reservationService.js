"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ReservationService extends Model {
        static associate(models) {
            this.belongsTo(models.Reservation, { foreignKey: "reservationId", as: "reservation" });
            this.belongsTo(models.Service, { foreignKey: "serviceId", as: "service" });
        }
    }
    ReservationService.init(
        {
            reservationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Reservations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            serviceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Services',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            maxLimit: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ReservationService",
            tableName: "ReservationServices", // Explicitly define table name
        }
    );
    return ReservationService;
};
