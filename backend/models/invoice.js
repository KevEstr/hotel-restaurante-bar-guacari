"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            // Una factura pertenece a una reserva
            this.belongsTo(models.Reservation, {
                foreignKey: "reservationId",
                as: "reservation",
            });
        }
    }

    Invoice.init(
        {
            reservationId: DataTypes.INTEGER,
            clientDetails: DataTypes.JSON,
            orders: DataTypes.JSON,
            reservations: DataTypes.JSON,
            subtotalOrders: DataTypes.FLOAT,
            subtotalReservations: DataTypes.FLOAT,
            total: DataTypes.FLOAT,
            invoiceDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Invoice",
            tableName: "invoices"
        }
    );

    return Invoice;
};
