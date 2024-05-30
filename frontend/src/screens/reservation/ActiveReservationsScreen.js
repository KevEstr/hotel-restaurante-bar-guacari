import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* components */
import LoaderHandler from "../../components/loader/LoaderHandler";
import HeaderContent from "../../components/HeaderContent";
import Table from "../../components/TableReservation";
import {
    OccupiedTableLoader,
    FreeTableLoader,
} from "../../components/loader/SkeletonLoaders";

/* actions */
import { allRooms } from "../../actions/roomActions";

const ActiveReservationsScreen = ({ history }) => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const roomList = useSelector((state) => state.roomList);
    const { loading, error, rooms } = roomList;

    useEffect(() => {
        dispatch(allRooms());
    }, [dispatch, history, userInfo]);

    const occupiedTableLoader = () => {
        let tableSkeleton = [];
        for (let i = 0; i < 16; i++) {
            tableSkeleton.push(
                <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={i}>
                    {" "}
                    <OccupiedTableLoader />{" "}
                </div>
            );
        }
        return tableSkeleton;
    };

    const freeTableLoader = () => {
        let tableSkeleton = [];
        for (let i = 0; i < 6; i++) {
            tableSkeleton.push(
                <div className="col-12" key={i}>
                    {" "}
                    <FreeTableLoader />{" "}
                </div>
            );
        }
        return tableSkeleton;
    };

    const filterRoomsByState = (active_status) => {
        const mappedTables = rooms.filter((room) => {
            return room.active_status === active_status;
        });
        return mappedTables;
    };

    const renderOccupiedTables = () =>
        filterRoomsByState(true).map((room) => (
            <div key={room.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <Table room={room} />
            </div>
        ));

    const renderFreeRooms = () =>
        filterRoomsByState(false).map((room) => (
            <Link
                to={`/reservation/create/${room.id}/room`}
                key={room.id}
                className="btn btn-block btn-success btn-lg"
            >
                <p className="text-center my-0">
                    <i className="fas fa-utensils float-left my-1"></i>
                    {room.name}
                </p>
            </Link>
        ));

    return (
        <>
            <HeaderContent name={"Reservaciones"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-md-9 col-lg-9">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Habitaciones Ocupadas
                                    </h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <LoaderHandler
                                            loading={loading}
                                            error={error}
                                            loader={occupiedTableLoader()}
                                            render={renderOccupiedTables}
                                        />
                                    </div>
                                </div>
                                {/* /.card-body */}
                            </div>
                        </div>
                        {/* /.col */}
                        <div className="col-12 col-md-3 col-lg-3">
                            <div className="card">
                                <div className="card-header">Habitaciones Disponibles</div>
                                <div className="card-body">
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        loader={freeTableLoader()}
                                        render={renderFreeRooms}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default ActiveReservationsScreen;
