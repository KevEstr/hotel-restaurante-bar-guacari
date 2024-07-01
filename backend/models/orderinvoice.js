"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class OrderInvoice extends Model {
        static associate(models) {
           
        }
    }

    OrderInvoice.init(
        {
            table: DataTypes.STRING,
            waiter: DataTypes.STRING,
            date: DataTypes.STRING,
            products: DataTypes.JSON,
            note: DataTypes.STRING,
            client: DataTypes.STRING,
            orderId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "OrderInvoice",
            tableName: "orderinvoices"
        }
    );

    return OrderInvoice;
};
