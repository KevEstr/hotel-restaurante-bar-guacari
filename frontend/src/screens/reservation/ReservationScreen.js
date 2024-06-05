import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";


/* Actions */
import { listReservations } from "../../actions/reservationActions";

const ReservationScreen = ({ history }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");


    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const reservationList = useSelector((state) => state.reservationList);
    const { loading, error, reservations, page, pages } = reservationList;

    

    useEffect(() => {
        dispatch(listReservations({ keyword, pageNumber}));
    }, [dispatch, history, userInfo, pageNumber, keyword]);

    const renderCreateButton = () => (
        <Link to="/activeReservation">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-edit" /> Nueva reservación
            </button>
        </Link>
    );



    const renderTable = () => (
        // console.log(reservations);
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th className="d-none d-sm-table-cell">Habitación</th>
                    <th>Pagada</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {reservations.map((reservation) => (
                    
                    <tr key={reservation.id}>
                        <td>{reservation.id}</td>
                        <td>{reservation.client.name}</td>
                        <td className="d-none d-sm-table-cell h4">
                        </td>
                        <td>
                            {reservation.is_paid ? (
                                <h4 className="text-success">
                                    <i className="fas fa-check"></i>
                                </h4>
                            ) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )}
                        </td>
                        <td className="d-none d-sm-table-cell h4">
                            <span className={"badge bg-success"}>
                                ${reservation.price}
                            </span>
                        </td>
                        <td>
                            <Link
                                to={`/reservation/${reservation.id}/view`}
                                className="btn btn-info btn-lg"
                            >
                                Ver
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderReservations = () => (
        <>
            <div className="card ">
                <div className="card-header">
                    <h3 className="card-title">Todas las reservaciones</h3>
                    <div className="card-tools">
                        <Search
                            keyword={keyword}
                            setKeyword={setKeyword}
                            setPage={setPageNumber}
                        />
                    </div>
                </div>
                {/* /.card-header */}
                <div className="card-body table-responsive p-0">
                    <LoaderHandler
                        loading={loading}
                        error={error}
                        loader={DataTableLoader()}
                        render={renderTable}
                    />
                </div>
                {/* /.card-body */}
            </div>

            <Pagination page={page} pages={pages} setPage={setPageNumber} />
        </>
    );

    return (
        <>
            <HeaderContent name={"Órdenes"} />

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {renderCreateButton()}
                            <hr />
                            {renderReservations()}
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default ReservationScreen;
