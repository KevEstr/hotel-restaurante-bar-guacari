'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderAudit extends Model {
    static associate(models) {
      // Asociaciones aquí
    }
  }

  OrderAudit.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      concept: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'OrderAudit',
    }
  );

  return OrderAudit;
};
