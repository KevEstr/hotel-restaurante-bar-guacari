"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class TableAudit extends Model {
        static associate(models) {
        
        }
    }

    TableAudit.init(
        {
            userId: DataTypes.INTEGER,
            reservationId: DataTypes.INTEGER,
            concept: DataTypes.STRING,
            is_delete: DataTypes.BOOLEAN,
            orderId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "TableAudit",
            tableName: "tableaudits",
        }
    );
    return TableAudit;
};
