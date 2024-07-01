"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    class Agreement extends Model {
        static associate(models) {
            // Define association here
            this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            this.belongsToMany(models.Service, { through: models.AgreementService, foreignKey: 'agreementId', as: 'service' });

        }
    }

    Agreement.init(
        {
            name: DataTypes.STRING,
            userId: DataTypes.INTEGER,

        },
        {
            sequelize,
            modelName: "Agreement",
            tableName: "agreements",
        }
    );
    return Agreement;
};
