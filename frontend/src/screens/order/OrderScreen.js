import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";

import {listAgreements} from "../../actions/agreementActions";
import {listPayments} from "../../actions/paymentActions";

import {FormattedDate} from "../../utils/formattedDate";

/* Actions */
import { listOrders } from "../../actions/orderActions";

const OrderScreen = ({ history }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;

    const [totalCredit, setTotalCredit] = useState(0);
    const [totalTransfer, setTotalTransfer] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalAccumulated, setTotalAccumulated] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

    const paymentList = useSelector((state) => state.paymentList);
    const { payments } = paymentList;

    useEffect(() => {
        dispatch(listOrders({ keyword, pageNumber, delivery: false }));
        dispatch(listAgreements());
        dispatch(listPayments());

    }, [dispatch, history, userInfo, pageNumber, keyword]);

    useEffect(() => {
        let credit = 0;
        let transfer = 0;
        let cash = 0;
        let accumulated = 0;
    
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
          
            return (
              (!startDate || orderDate >= start) &&
              (!endDate || orderDate <= end || orderDate.getDate() === end.getDate())
            );
          });
    
        filteredOrders.forEach((order) => {
            if (order.isPaid) {
                accumulated += order.total;
                if (order.paymentId === 1) {
                    credit += order.total;
                } else if (order.paymentId === 2) {
                    transfer += order.total;
                } else if (order.paymentId === 3) {
                    credit += order.total;
                }
            }
        });
    
        setTotalCredit(credit);
        setTotalTransfer(transfer);
        setTotalCash(cash);
        setTotalAccumulated(accumulated);
    }, [orders, startDate, endDate]);

    const renderCreateButton = () => (
        <Link to="/order/create">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-edit" /> Nueva órden
            </button>
        </Link>
    );

    const DateFilter = ({ setStartDate, setEndDate }) => (
        <div className="date-filter">
            <input 
                type="date" 
                onChange={(e) => setStartDate(e.target.value)} 
                placeholder="Fecha de inicio" 
            />
            <input 
                type="date" 
                onChange={(e) => setEndDate(e.target.value)} 
                placeholder="Fecha de fin" 
            />
        </div>
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


    const renderTable = () => {
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return (!startDate || orderDate >= start) && (!endDate || orderDate <= end);
        });

        return (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th className="d-none d-sm-table-cell">Mesa</th>
                    <th className="d-none d-sm-table-cell">Convenio</th>
                    <th>Pagada</th>
                    <th>Método Pago</th>
                    <th>Total</th>
                    <th>Fecha Pago</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.client.name}</td>
                        <td className="d-none d-sm-table-cell h4">
                            {order.table ? (
                                <span className={"badge bg-primary"}>
                                    {order.table.name}
                                </span>
                            ) : (
                                <span className={"badge bg-info"}>
                                    DOMICILIO
                                </span>
                            )}
                        </td>

                        <td className="d-none d-sm-table-cell">
                        {getAgreementName(order.client.agreementId)}
                        </td>

                        <td>
                            {order.isPaid ? (
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
                            {order.isPaid ? (
                                <>
                                {getPaymentName(order.paymentId)}
                                </>
                            ) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )}
                        </td>

                        <td className="d-none d-sm-table-cell h4">
                            <span className={"badge bg-success"}>
                                ${order.total}
                            </span>
                        </td>

                        <td className="d-none d-sm-table-cell">
                            <FormattedDate dateString={order.createdAt} />
                        </td>

                        <td>
                            <Link
                                to={`/order/${order.id}/view`}
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
    };


    const renderOrders = () => (
        <>
            <div className="card ">
                <div className="card-header">
                    <h3 className="card-title">Todas las órdenes</h3>
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
            <HeaderContent name={"Historial de Órdenes"} />

            <section className="content">
                <div className="container-fluid">
                <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />
                {renderTotals()}
                    <div className="row">
                        <div className="col-12">
                            {renderCreateButton()}
                            <hr />
                            {renderOrders()}
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

export default OrderScreen;
