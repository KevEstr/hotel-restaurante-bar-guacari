"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Laundry extends Model {
        
        static associate(models) {

            Laundry.belongsTo(models.Client, {
                foreignKey: 'clientId',
                as: 'client'
                
            });
        }
    }
    Laundry.init(
        {
            quantity: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            clientId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Laundry",
            tableName: "laundries",
        }
    );
    return Laundry;
};
