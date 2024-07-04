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

            this.hasMany(models.Order, {
                foreignKey: "reservation_id",
                as: "orders", // Usualmente usamos plural para una relación de hasMany
            });

            this.belongsToMany(models.Service, {
                through: models.ReservationService,
                foreignKey: "reservationId",
                otherKey: "serviceId", // Corregido de otherkey a otherKey
                as: "service",
            });
            
            this.belongsTo(models.User, { foreignKey: "userId", as: "user" });

            this.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
            this.hasMany(models.ReservationAdvance, { foreignKey: "reservationId", as: "advances" });
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
            advance: DataTypes.INTEGER,
            pending_payment: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Reservation",
            tableName: "reservations",
        }
    );

    return Reservation;
    
};
