import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";

import {listAgreements} from "../../actions/agreementActions";
import {listPayments} from "../../actions/paymentActions";

import {FormattedDate} from "../../utils/formattedDate";

/* Actions */
import { listOrders } from "../../actions/orderActions";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
} from '@material-ui/core';
//import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import subDays from 'date-fns/subDays';

const OrderFridgeScreen = ({ history }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);

    const STORAGE_KEY = 'ingredient_movement_filters';

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;

    const [totalCredit, setTotalCredit] = useState(0);
    const [totalTransfer, setTotalTransfer] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [totalAccumulated, setTotalAccumulated] = useState(0);

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

    const paymentList = useSelector((state) => state.paymentList);
    const { payments } = paymentList;

    let type = "true";
    let delivery= null;


    useEffect(() => {
        const endDate = new Date(); // Hoy
        const startDate = subDays(endDate, 6); // Hace 6 días
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setStartDate(startDate);
        setEndDate(endDate);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(listOrders(keyword, pageNumber, delivery, null, type, startDate, endDate, paymentId));
            console.log("LIST ORDERS: ", keyword, pageNumber, delivery, null, type, startDate, endDate, paymentId)
        }

    }, [dispatch, history, keyword, pageNumber, type, startDate, endDate, paymentId]);

    useEffect(() => {
        dispatch(listAgreements());
        dispatch(listPayments());

    }, [dispatch, history, userInfo, pageNumber, keyword]);

    useEffect(() => {
        let credit = 0;
        let transfer = 0;
        let cash = 0;
        let accumulated = 0;

        if(orders){
            console.log("ORDERS: ",orders);
            orders.forEach((order) => {
                if (order.isPaid) {
                  accumulated += order.total;
                  if (order.paymentId === 1) {
                    credit += order.total;
                  } else if (order.paymentId === 2) {
                    transfer += order.total;
                  } else if (order.paymentId === 3) {
                    cash += order.total;
                  }
                }
              });
        }
    
        
    
        setTotalCredit(credit);
        setTotalTransfer(transfer);
        setTotalCash(cash);
        setTotalAccumulated(accumulated);
      }, [orders]);

      const handleFilter = () => {
        const startOfDay = new Date(tempStartDate);
        startOfDay.setHours(0, 0, 0, 0);
        setStartDate(startOfDay);
        
        const endOfDay = new Date(tempEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        setEndDate(endOfDay);
        dispatch(listOrders(keyword, pageNumber, null, null, type, startDate, endDate, paymentId));
    };

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setTempStartDate(null);
        setTempEndDate(null);
        setPaymentId('');
        setKeyword('');
    };

    const renderCreateButton = () => (
        <Link to="/order/create">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-edit" /> Nueva órden
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


    const renderTable = () => {
        if (orders === undefined || orders.length === 0) {
            return (
                <div className="alert alert-info" role="alert">
                    No hay productos de la nevera para mostrar.
                </div>
            );
        }
    
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
                    {orders.map((order) => (
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
        <div className="card">
                    <Filters
                        tempStartDate={tempStartDate}
                        setTempStartDate={setTempStartDate}
                        tempEndDate={tempEndDate}
                        setTempEndDate={setTempEndDate}
                        paymentId={paymentId}
                        setPaymentId={setPaymentId}
                        handleFilter={handleFilter}
                        handleClearFilters={handleClearFilters}
                    />
            
                <div className="card-header">
                    <h3 className="card-title">Todas los productos de la nevera</h3>
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
            <HeaderContent name={"Historial de la Nevera"} />

            <section className="content">
                <div className="container-fluid">
                {renderTotals()}
                    <div className="row">
                        <div className="col-12">
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

export default OrderFridgeScreen;
