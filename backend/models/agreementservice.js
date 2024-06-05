"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class AgreementServices extends Model {
        static associate(models) {
            // Define association here
        }
    }
    AgreementServices.init(
        {
            agreementId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Agreements', 
                    key: 'id'
                }
            },
            serviceId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Services', 
                    key: 'id'
                }
            },
            
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: "AgreementServices",
            tableName: "agreementservices"
        }
    );
    return AgreementServices;
};
