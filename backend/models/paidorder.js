"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class PaidOrder extends Model {
        static associate(models) {
           
        }
    }

    PaidOrder.init(
        {
            client: DataTypes.JSON,     
            products: DataTypes.JSON,   
            payment: DataTypes.STRING,
            date: DataTypes.DATE,
            orderId: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "PaidOrder",
            tableName: "paidorders"
        }
    );

    return PaidOrder;
};
