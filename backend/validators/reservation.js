const { check } = require("express-validator");

exports.reservationCreateValidator = [
    check("roomId")
        .isNumeric()
        .withMessage("Client ID must be a number")
        .optional({ nullable: true }),
];
