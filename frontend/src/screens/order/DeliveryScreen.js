import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {FormattedDate} from "../../utils/formattedDate";

/* components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import Filters from "../../components/Filters";

/* actions */
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

const DeliveryScreen = ({ history }) => {
    const dispatch = useDispatch();

    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;
    let type = "false";
    let delivery= "true";


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
            console.log("LIST ORDERS: ", keyword, pageNumber, 0, null, type, startDate, endDate, paymentId)
        }

    }, [dispatch, history, keyword, pageNumber,delivery, type, startDate, endDate, paymentId]);

    /*useEffect(() => {
        dispatch(listOrders({ keyword, pageNumber, delivery: true }));
    }, [dispatch, history, userInfo, pageNumber, keyword]);*/

    const renderCreateButton = () => (
        <Link to="/order/create/delivery">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-truck" /> Nuevo domicilio
            </button>
        </Link>
    );

    const handleFilter = () => {
        const startOfDay = new Date(tempStartDate);
        startOfDay.setHours(0, 0, 0, 0);
        setStartDate(startOfDay);
        
        const endOfDay = new Date(tempEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        setEndDate(endOfDay);
        dispatch(listOrders(keyword, pageNumber, delivery, null, type, startDate, endDate, paymentId));
    };

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setTempStartDate(null);
        setTempEndDate(null);
        setPaymentId('');
        setKeyword('');
    };

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th className="d-none d-sm-table-cell">Dirección</th>
                    <th className="d-none d-sm-table-cell">Tel</th>
                    <th className="d-none d-sm-table-cell">Total</th>
                    <th className="d-none d-sm-table-cell">Fecha</th>
                    <th>Revisar</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.client.name}</td>
                        <td className="d-none d-sm-table-cell">
                            {order.client.address}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {order.client.phone}
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

    const renderDeliveries = () => (
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
                    <h3 className="card-title">Domicilios activos</h3>
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
            <HeaderContent name={"Domicilios"} />

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {renderCreateButton()}
                            <hr />

                            {renderDeliveries()}

                            {/* /.card-body */}
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

export default DeliveryScreen;
