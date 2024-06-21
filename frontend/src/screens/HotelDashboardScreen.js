import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "./../components/HeaderContent";
import SmallBox from "./../components/SmallBox";
import DataTableLoader from "../components/loader/DataTableLoader";
import LoaderHandler from "../components/loader/LoaderHandler";

/* Actions */

import {
    OccupiedTableLoader,
    SkeletonBoxes,
    SkeletonSales,
} from "../components/loader/SkeletonLoaders";

import { getStatistics } from "../actions/reservationActions";

const HotelDashboardScreen = ({ history }) => {
    const dispatch = useDispatch();

    //user state
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const reservationStatistics = useSelector((state) => state.reservationStatistics);
    const { loading, error, data } = reservationStatistics;

    const { reservations, sales, statistics } = data;

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        }
        dispatch(getStatistics());
    }, [dispatch, history, userInfo]);

    //get all in place orders
    const reservationsInPlace = (reservations) => {
        const reservationsInPlace = reservations.filter(function (item) {
            return item.delivery === false;
        });

        return reservationsInPlace;
    };

    const getTodaySales = (items) => {
        let day = new Date();
        day = day.toISOString().slice(8, 10);
        const newSales = items.filter(function (item) {
            const saleDay = item.updatedAt.slice(8, 10);
            return day === saleDay;
        });
        return newSales;
    };

    //table row click from in place orders
    const handleRowClick = (e, id) => {
        e.preventDefault();
        history.push(`/reservation/${id}/view`);
    };

    const returnSales = () => {
        var indents = [];
        for (var i = 0; i < (sales.length > 3 ? 4 : sales.length); i++) {
            indents.push(
                <tr key={sales[i].id}>
                    <td className="font-weight-bold">{sales[i].id}</td>
                    <td className="h4">
                        {sales[i].delivery ? (
                            <span className={"badge bg-primary"}>EN RESTAURANTE</span>
                        ) : (
                            <span className={"badge bg-info"}>DOMICILIO</span>
                        )}
                    </td>
                    <td className="h4">
                        <span className={"badge bg-success"}>
                            ${sales[i].total}
                        </span>
                    </td>
                    <td className="h4">
                        <span className={"badge bg-warning"}>
                            {sales[i].products.length}
                        </span>
                    </td>
                    <td>
                        <Link
                            to={`/reservation/${sales[i].id}/view`}
                            className="btn btn-info"
                        >
                            <i className="fas fa-search"></i>
                        </Link>
                    </td>
                </tr>
            );
        }
        return indents;
    };

    const renderSmallBoxes = () => (
        <>
            <SmallBox
                number={reservations.length}
                paragraph={"Órdenes Activas"}
                link={"reservation"}
                color={"success"}
                icon={"fas fa-utensils"}
            />

            <SmallBox
                number={reservationsInPlace(reservations).length}
                paragraph={"Reservaciones en restaurante"}
                link={"active"}
                color={"info"}
                icon={"fas fa-users"}
            />
            <SmallBox
                number={reservations.length}
                paragraph={"Total Reservas"}
                link={"reservation"}
                color={"warning"}
                icon={"ion ion-bag"}
            />
        </>
    );

    const renderSales = () => (
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="card">
                    <div className="card-header border-0">
                        <h3 className="card-title">Últimas ventas</h3>
                        <div className="card-tools">
                            <Link to="/reservation" className="btn btn-tool btn-sm">
                                <i className="nav-icon far fa-clipboard" />
                            </Link>
                        </div>
                    </div>
                    <div className="card-body table-responsive p-0">
                        <table className="table table-striped table-valign-middle text-center">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Total</th>
                                    <th>Productos</th>
                                    <th>Más</th>
                                </tr>
                            </thead>
                            <tbody>{returnSales(sales)}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-6">
                <div className="card">
                    <div className="card-header border-0">
                        <h3 className="card-title">Restobar Panorama</h3>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <p className="text-warning text-xl">
                                <i className="fas fa-shopping-cart"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <i className="ion ion-android-arrow-up text-warning" />{" "}
                                    {statistics && statistics.reservations}
                                </span>
                                <span className="text-muted">
                                    TOTAL ÓRDENES COMPLETADAS
                                </span>
                            </p>
                        </div>
                        {/* /.d-flex */}
                        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <p className="text-info text-xl">
                                <i className="fas fa-truck"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <i className="ion ion-android-arrow-up text-info" />{" "}
                                    {statistics && statistics.deliveries}
                                </span>
                                <span className="text-muted">
                                    TOTAL DOMICILIOS COMPLETADOS
                                </span>
                            </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <p className="text-success text-xl">
                                <i className="fas fa-money-bill-wave"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <span className="text-success">
                                        <i className="fas fa-dollar-sign text-success"></i>{" "}
                                        {statistics && statistics.today}
                                    </span>
                                </span>
                                <span className="text-muted">VENTAS HOY</span>
                            </p>
                        </div>
                        {/* /.d-flex */}
                        <div className="d-flex justify-content-between align-items-center mb-0">
                            <p className="text-danger text-xl">
                                <i className="fas fa-piggy-bank"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <span className="text-success">
                                        <i className="fas fa-dollar-sign"></i>{" "}
                                        {statistics && statistics.total}
                                    </span>
                                </span>
                                <span className="text-muted">TOTAL VENTAS</span>
                            </p>
                        </div>
                        {/* /.d-flex */}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <table className="table m-0 table-hover">
            <thead>
                <tr>
                    <th>Órden ID</th>
                    <th>Cliente</th>
                    <th>Mesa</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {reservationsInPlace(reservations)
                    .splice(0, 5)
                    .map((reservation) => (
                        <tr
                            key={reservation.id}
                            onClick={(e) => handleRowClick(e, reservation.id)}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            <td>
                                <h4>
                                    <span className={"badge bg-primary"}>
                                        {reservation.id}
                                    </span>
                                </h4>
                            </td>
                            <td>{reservation.client ? reservation.client.name : ""}</td>
                            <td>{reservation.room ? reservation.room.name : ""}</td>
                            <td>
                                <h4>
                                    <span className={"badge bg-success"}>
                                        ${reservation.total}
                                    </span>
                                </h4>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );

    return (
        <>
            <HeaderContent name={"Panel General Del Restaurante"} />

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            loader={<SkeletonBoxes />}
                            render={renderSmallBoxes}
                        />
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-9">
                            <div className="card">
                                <div className="card-header border-transparent">
                                    <h3 className="card-title">
                                        Últimas órdenes realizadas
                                    </h3>
                                    <div className="card-tools">
                                        <button
                                            type="button"
                                            className="btn btn-tool"
                                            data-card-widget="collapse"
                                        >
                                            <i className="fas fa-minus" />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <LoaderHandler
                                            loading={loading}
                                            error={error}
                                            loader={<DataTableLoader />}
                                            render={renderOrders}
                                        />
                                    </div>
                                </div>
                                <div className="card-footer clearfix">
                                    <Link
                                        to={"/reservation/create"}
                                        className="btn btn-sm btn-info float-left"
                                    >
                                        Generar nueva órden
                                    </Link>
                                    <Link
                                        to={"/reservation"}
                                        className="btn btn-sm btn-secondary float-right"
                                    >
                                        Ver todas las órdenes
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Últimos domicilios generados
                                    </h3>
                                    <div className="card-tools">
                                        <button
                                            type="button"
                                            className="btn btn-tool"
                                            data-card-widget="collapse"
                                        >
                                            <i className="fas fa-minus" />
                                        </button>
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default HotelDashboardScreen;
