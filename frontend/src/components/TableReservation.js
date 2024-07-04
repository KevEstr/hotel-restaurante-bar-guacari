import React from "react";
import { Link } from "react-router-dom";

const Table = ({ room }) => {
    console.log("Datos de la tabla:", room)
    return (
        <Link
            to={
                room.reservations[0]
                    ? `/reservation/${room.reservations[0].id}/view`
                    : "/activeReservation"
            }
        >
            <div className="small-box bg-info">
                <div className="inner">
                    <h3>{room.name}</h3>
                    <p>
                        Reserva ID:{" "}
                        {room.reservations.map((reservation) => {
                            return reservation.id;
                        })}
                    </p>
                </div>
                <div className="icon">
                    <i className="fas fa-solid"></i>
                </div>
                <div className="small-box-footer">
                    Más info <i className="fa fa-arrow-circle-right" />
                </div>
            </div>
        </Link>
    );
};

export default Table;
