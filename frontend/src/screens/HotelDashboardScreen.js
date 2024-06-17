import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "./../components/HeaderContent";
import SmallBox from "./../components/SmallBox";
import DataTableLoader from "../components/loader/DataTableLoader";
import LoaderHandler from "../components/loader/LoaderHandler";

/* Actions */
import {
    SkeletonBoxes,
    SkeletonSales,
} from "../components/loader/SkeletonLoaders";
import { listAllReservations } from "../actions/reservationActions";
import { listAgreements } from "../actions/agreementActions";
import { listPayments } from "../actions/paymentActions";
import { FormattedDate } from "../utils/formattedDate";

const HotelDashboardScreen = ({ history }) => {
    const dispatch = useDispatch();

    // user state
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");

    const reservationAllList = useSelector((state) => state.reservationAllList);
    const { loading, error, reservations, page, pages } = reservationAllList;

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

    const paymentList = useSelector((state) => state.paymentList);
    const { payments } = paymentList;

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        }
        dispatch(listAllReservations({ keyword, pageNumber}));
        dispatch(listAgreements());
        dispatch(listPayments());
    }, [dispatch, history, keyword, pageNumber, userInfo]);

    const getAgreementName = (agreementId) => {
        if (agreements && agreements.length > 0) {
            const agreement = agreements.find((agreement) => agreement.id === agreementId);
            return agreement ? agreement.name : '';
        }
        return '';
    };

    const getPaymentName = (paymentId) => {
        if (payments && payments.length > 0) {
            const payment = payments.find((payment) => payment.id === paymentId);
            return payment ? payment.name : '';
        }
        return '';
    };

    const renderSmallBoxes = () => (
        <>
            <SmallBox
                number={reservations.length}
                paragraph={"Reservas Activas"}
                link={"reservation"}
                color={"success"}
                icon={"fas fa-bed"}
            />
            <SmallBox
                number={reservations.filter(res => res.is_paid).length}
                paragraph={"Reservas Pagadas"}
                link={"paid"}
                color={"info"}
                icon={"fas fa-credit-card"}
            />
            <SmallBox
                number={reservations.filter(res => !res.is_paid).length}
                paragraph={"Reservas No Pagadas"}
                link={"unpaid"}
                color={"danger"}
                icon={"fas fa-money-bill-wave"}
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

    const renderReservations = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Habitación</th>
                    <th>Convenio</th>
                    <th>Pagada</th>
                    <th>Método Pago</th>
                    <th>Total</th>
                    <th>Fecha Pago</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                        <td>{reservation.id}</td>
                        <td>{reservation.client ? reservation.client.name : "Cliente desconocido"}</td>
                        <td>
                            {reservation.room && Array.isArray(reservation.room) && reservation.room.length > 0 ? (
                                reservation.room.map(room => (
                                    <span key={room.id} className={"badge bg-primary"}>
                                        {room.name}
                                    </span>
                                ))
                            ) : (
                                <span className={"badge bg-info"}>
                                    SIN HABITACIÓN
                                </span>
                            )}
                        </td>
                        <td>{getAgreementName(reservation.client.agreementId)}</td>
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
                        <td>
                            {reservation.is_paid ? getPaymentName(reservation.paymentId) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )}
                        </td>
                        <td className="h4">
                            <span className={"badge bg-success"}>
                                ${reservation.total}
                            </span>
                        </td>
                        <td>
                            <FormattedDate dateString={reservation.createdAt} />
                        </td>
                        <td>
                            <Link to={`/reservation/${reservation.id}/view`} className="btn btn-info">
                                <i className="fas fa-search"></i>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <HeaderContent name={"Panel General del Hotel"} />

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

                    {userInfo.isAdmin && (
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            loader={<SkeletonSales />}
                            render={renderReservations}
                        />
                    )}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header border-transparent">
                                    <h3 className="card-title">Últimas reservas realizadas</h3>
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
                                            render={renderReservations}
                                        />
                                    </div>
                                </div>
                                <div className="card-footer clearfix">
                                    <Link
                                        to={"/activeReservation"}
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
