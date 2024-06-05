"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Room extends Model {

        static associate(models) {
            this.belongsToMany(models.Reservation, {
                through: "RoomReservation",
                foreignKey: "roomId", // FK correcta en la tabla intermedia
                otherKey: "reservationId", // Añadido para claridad
                as: "reservations",
            });
        }
    }

    
    Room.init(
        {
            name: DataTypes.STRING,
            active_status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Room",
        }
    );
    return Room;
};
