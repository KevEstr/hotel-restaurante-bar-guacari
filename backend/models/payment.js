"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            this.hasMany(models.Reservation, { foreignKey: 'paymentId', as: 'reservations' });
            this.hasMany(models.Order, { foreignKey: 'paymentId', as: 'orders' });

        }


        
    }
    Payment.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            total_accumulated: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: "Payment",
            tableName: "payment"
        }
    );
    return Payment;
};