const Room = require("../models").Room;
const Reservation = require("../models").Reservation;

/* check stock of each product */
exports.reservation = async (list) => {
    for (let index = 0; index < list.length; index++) {
        const roomSearched = await Room.findByPk(list[index].id);
        if (roomSearched.quantity < list[index].quantity) {
            return false;
        }
    }
    return true;
};

exports.updateReservation = async (id, active_status) => {
    const room = await Room.findByPk(id);
    room.active_status = active_status;
    await room.save();
};

exports.updateRoom = async (id, active_status) => {
    const room = await Room.findByPk(id);
    room.active_status = active_status;
    await room.save();
};
