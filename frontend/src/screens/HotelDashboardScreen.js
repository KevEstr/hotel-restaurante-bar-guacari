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
    const { loading, error, data = { reservations: [], sales: [], statistics: {} } } = reservationStatistics;

    const { reservations, sales, statistics } = data;

    const totalRooms = statistics.totalRooms || 0;
    const reservedRooms = statistics.reservedRooms || 0;
    const maintenanceRooms = statistics.maintenanceRooms || 0;
    const availableRooms = totalRooms - reservedRooms - maintenanceRooms;
    const occupiedPercentage = totalRooms ? (reservedRooms / totalRooms) * 100 : 0;    

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        }
        dispatch(getStatistics());
    }, [dispatch, history, userInfo]);

    useEffect(() => {
        console.log("reservationStatistics data:", data);
    }, [data]);


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

    const returnSales = (sales) => {
        console.log("Sales:", sales);
        if (!sales || !Array.isArray(sales)) {
            return null; // o un mensaje de carga o vacío
        }
    
        var indents = [];
        for (var i = 0; i < (sales.length > 3 ? 4 : sales.length); i++) {
            const sale = sales[i];
            
            indents.push(
                <tr key={sale.id}>
                    <td className="font-weight-bold">{sale.id}</td>
                    <td className="h4">
                        <span className={"badge bg-success"}>
                            ${sale.price}
                        </span>
                    </td>
                    <td className="h4">
                        <span className={"badge bg-warning"}>
                            {sale.note ? sale.note.length : 0}
                        </span>
                    </td>
                    <td>
                        <Link
                            to={`/reservation/${sale.id}/view`}
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
                paragraph={"Reservas Activas"}
                link={"reservation"}
                color={"success"}
                icon={"fas fa-solid fa-hotel"}
            />
            <SmallBox
                number={`${occupiedPercentage.toFixed(2)}%`}
                paragraph={"Disponibilidad del Hotel"}
                link={"reservation"}
                color={"info"}
                icon={"fas fa-bed"}
            />
        </>
    );

    const renderSales = () => (
        <div className="row">
            <div className="col-12 col-lg-7">
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
                                    <th>Total</th>
                                    <th>Nota</th>
                                    <th>Más</th>
                                </tr>
                            </thead>
                            <tbody>{returnSales(sales)}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-5">
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
                                    {statistics.reservations}
                                </span>
                                <span className="text-muted">
                                    TOTAL RESERVAS COMPLETADAS
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
                                        {statistics.today}
                                    </span>
                                </span>
                                <span className="text-muted">VENTAS HOY</span>
                            </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <p className="text-danger text-xl">
                                <i className="fas fa-piggy-bank"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <span className="text-success">
                                        <i className="fas fa-dollar-sign"></i>{" "}
                                        {statistics.total}
                                    </span>
                                </span>
                                <span className="text-muted">TOTAL VENTAS</span>
                            </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <p className="text-primary text-xl">
                                <i className="fas fa-bed"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <span className="text-primary">
                                        <i className="fas fa-door-open"></i>{" "}
                                        {availableRooms}
                                    </span>
                                </span>
                                <span className="text-muted">HABITACIONES DISPONIBLES</span>
                            </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-0">
                            <p className="text-warning text-xl">
                                <i className="fas fa-hotel"></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <span className="text-warning">
                                        <i className="fas fa-hotel"></i>{" "}
                                        {totalRooms}
                                    </span>
                                </span>
                                <span className="text-muted">HABITACIONES TOTALES</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <>
            <HeaderContent name={"Panel General Del Hotel"} />

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
                        <div className="col-12 col-md-12">
                            <div className="card">
                                <div className="card-header border-transparent">
                                    
                                    <div className="card-tools">
                                        <button
                                            type="button"
                                            className="btn btn-tool"
                                            data-card-widget="collapse"
                                        >
                                            <i className="fas fa-minus" />
                                        </button>
                                    </div>
                                    {userInfo.isAdmin && (
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            loader={<SkeletonSales />}
                            render={renderSales}
                        />
                    )}

                                </div>
                                <div className="card-footer clearfix">
                                    <Link
                                        to={"/reservation/create"}
                                        className="btn btn-sm btn-info float-left"
                                    >
                                        Generar nueva reserva
                                    </Link>
                                    <Link
                                        to={"/reservation"}
                                        className="btn btn-sm btn-secondary float-right"
                                    >
                                        Ver todas las reservas
                                    </Link>
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
