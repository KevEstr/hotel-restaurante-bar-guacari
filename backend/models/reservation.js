"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {

    class Reservation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Client, {
                foreignKey: "clientId",
                as: "client",
            });
            this.belongsToMany(models.Room, {
                through: "RoomReservation",
                foreignKey: "reservationId",
                otherkey: "roomId",
                as: "room",
            });

            this.belongsToMany(models.Service, {
                through: models.ReservationService,
                foreignKey: "reservationId",
                otherKey: "serviceId", // Corregido de otherkey a otherKey
                as: "service",
            });
            

            this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
        }
    }
    Reservation.init(
        {
            price: DataTypes.INTEGER,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            note: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            clientId: DataTypes.INTEGER,
            paymentId: DataTypes.INTEGER,
            is_paid: DataTypes.BOOLEAN,
            total: DataTypes.INTEGER,
            
        },
        {
            sequelize,
            modelName: "Reservation",
        }
    );
    return Reservation;
};