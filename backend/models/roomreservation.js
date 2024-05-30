"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class RoomReservation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Reservation, { foreignKey: "reservationId", as: 'reservation'});
            this.belongsTo(models.Room, { foreignKey: "roomId", as: 'room' });
            
        }
    }
    RoomReservation.init(
        {
            reservationId: DataTypes.INTEGER,
            roomId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "RoomReservation",
            timestamps: false,
        }
    );
    return RoomReservation;
};
