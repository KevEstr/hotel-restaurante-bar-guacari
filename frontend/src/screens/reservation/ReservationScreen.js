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
import { listAllReservations } from "../../actions/reservationActions";
import {listAgreements} from "../../actions/agreementActions";
import {listPayments} from "../../actions/paymentActions";

import {FormattedDate} from "../../utils/formattedDate";

const ReservationScreen = ({ history }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalCredit, setTotalCredit] = useState(0);
    const [totalTransfer, setTotalTransfer] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalAccumulated, setTotalAccumulated] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const reservationAllList = useSelector((state) => state.reservationAllList);
    const { loading, error, reservations, page, pages } = reservationAllList;

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

    const paymentList = useSelector((state) => state.paymentList);
    const { payments } = paymentList;
    
    useEffect(() => {
        console.log("Dispatching listReservations with keyword:", keyword, "and pageNumber:", pageNumber);
        dispatch(listAllReservations({ keyword, pageNumber}));
        dispatch(listAgreements());
        dispatch(listPayments());
    }, [dispatch, history, userInfo, pageNumber, keyword]);

    useEffect(() => {
        let credit = 0;
        let transfer = 0;
        let cash = 0;
        let accumulated = 0;
    
        reservations.forEach((reservation) => {
          if (reservation.is_paid) {
            accumulated += reservation.total;
            if (reservation.paymentId === 1) {
              credit += reservation.total;
            } else if (reservation.paymentId === 2) {
              transfer += reservation.total;
            } else if (reservation.paymentId === 3) {
              cash += reservation.total;
            }
          }
        });
    
        setTotalCredit(credit);
        setTotalTransfer(transfer);
        setTotalCash(cash);
        setTotalAccumulated(accumulated);
      }, [reservations]);

    const renderCreateButton = () => (
        <Link to="/activeReservation">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-edit" /> Nueva Reserva
            </button>
        </Link>
    );

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

      const renderTotals = () => (
        <div className="row mb-3">
            <div className="col-12 col-md-3">
                <div className="info-box bg-light">
                    <span className="info-box-icon"><i className="fas fa-dollar-sign"></i></span>
                    <div className="info-box-content">
                        <span className="info-box-text">Total Efectivo</span>
                        <span className="info-box-number">${totalCash}</span>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-3">
                <div className="info-box bg-light">
                    <span className="info-box-icon"><i className="fas fa-credit-card"></i></span>
                    <div className="info-box-content">
                        <span className="info-box-text">Total Crédito</span>
                        <span className="info-box-number">${totalCredit}</span>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-3">
                <div className="info-box bg-light">
                    <span className="info-box-icon"><i className="fas fa-university"></i></span>
                    <div className="info-box-content">
                        <span className="info-box-text">Total Transferencia</span>
                        <span className="info-box-number">${totalTransfer}</span>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-3">
                <div className="info-box bg-light">
                    <span className="info-box-icon"><i className="fas fa-money-check-alt"></i></span>
                    <div className="info-box-content">
                        <span className="info-box-text">Total Acumulado</span>
                        <span className="info-box-number">${totalAccumulated}</span>
                    </div>
                </div>
            </div>
        </div>
    );
    

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th className="d-none d-sm-table-cell">Habitación</th>
                    <th className="d-none d-sm-table-cell">Convenio</th>
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
                        <td>{reservation.client && reservation.client.name ? reservation.client.name : "Cliente desconocido"}</td>
                        <td className="d-none d-sm-table-cell h4">
                            {reservation.room && Array.isArray(reservation.room) && reservation.room.length > 0 ? (
                                reservation.room.map(room => (
                                    <span key={room.id} className={"badge bg-primary"}>
                                        {room.name}
                                    </span>
                                ))
                            ) : (
                                <span className={"badge bg-info"}>
                                    DOMICILIO
                                </span>
                            )}
                        </td>
                        <td className="d-none d-sm-table-cell">
                        {getAgreementName(reservation.client.agreementId)}
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

                        <td>
                            {reservation.is_paid ? (
                                <>
                                {getPaymentName(reservation.paymentId)}
                                </>
                            ) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )}
                        </td>

                        <td className="d-none d-sm-table-cell h4">
                            <span className={"badge bg-success"}>
                                ${reservation.total}
                            </span>
                        </td>

                        <td className="d-none d-sm-table-cell">
                            <FormattedDate dateString={reservation.createdAt} />
                        </td>

                        <td>
                            <Link
                                to={`/reservation/${reservation.id}/view`}
                                className="btn btn-info btn-lg"
                            >
                                Ver
                            </Link>
                        </td>

                        <td>
                            <Link
                                to={`/reservation/${reservation.id}/view`}
                                className="btn btn-warning btn-lg"
                            >
                                Factura
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
                    <h3 className="card-title">Todas las reservas</h3>
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
            <HeaderContent name={"Historial de Reservas"} />

            <section className="content">
                <div className="container-fluid">
                    {renderTotals()}
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
