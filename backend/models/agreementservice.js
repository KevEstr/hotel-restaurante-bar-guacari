'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AgreementService extends Model {
        static associate(models) {
            this.belongsTo(models.Agreement, { foreignKey: 'agreementId', as: 'agreement' });
            this.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
        }
    }
    AgreementService.init({
        agreementId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Agreements',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        serviceId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Services',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    }, {
        sequelize,
        modelName: 'AgreementService',
        timestamps: true // Deshabilitar timestamps si no los necesitas
    });
    return AgreementService;
};
