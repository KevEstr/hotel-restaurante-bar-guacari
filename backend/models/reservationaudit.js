'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReservationAudit extends Model {
    static associate(models) {
      // Asociaciones aquí
    }
  }

  ReservationAudit.init(
    {
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      concept: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ReservationAudit',
      tableName: "reservationaudits",
    }
  );

  return ReservationAudit;
};
