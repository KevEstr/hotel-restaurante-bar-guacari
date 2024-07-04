"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {

    class ReservationAdvance extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            
            this.belongsTo(models.User, { foreignKey: "userId", as: "user" });

            this.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });

            this.belongsTo(models.Reservation, { foreignKey: "reservationId", as: "reservation" });

        }
    }
    ReservationAdvance.init(
        {
            userId: DataTypes.INTEGER,
            paymentId: DataTypes.INTEGER,
            advance: DataTypes.INTEGER,
            reservationId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "ReservationAdvance",
            tableName: "reservationadvances",
        }
    );

    return ReservationAdvance;
    
};
