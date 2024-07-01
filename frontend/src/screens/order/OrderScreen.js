import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

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

import { getInvoiceDetails } from '../../actions/orderInvoiceActions';

import { getPaidOrderDetails } from '../../actions/paidOrderActions';

import generateOrder from '../../utils/InvoicesRestaurant/generateOrder';
import generateInvoiceOrder from '../../utils/InvoicesRestaurant/generateInvoiceOrder';

import 'react-datepicker/dist/react-datepicker.css';
import subDays from 'date-fns/subDays';

const OrderScreen = ({ history }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");

    const [paymentId, setPaymentId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);

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

    const invoiceDetails = useSelector((state) => state.invoiceDetails);
    const { invoice } = invoiceDetails;

    const paidOrderDetails = useSelector((state) => state.paidOrderDetails);
    const { paidOrder } = paidOrderDetails;

    console.log("Datos Factura",invoice)


    let type = "false";
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
            console.log("LIST ORDERS: ", keyword, pageNumber, 0, null, type, startDate, endDate, paymentId)
        }

    }, [dispatch, history, keyword, pageNumber,delivery, type, startDate, endDate, paymentId]);

    useEffect(() => {
        //dispatch(listOrders({ keyword, pageNumber, delivery: 0, type: 0 }));
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
        dispatch(listOrders(keyword, pageNumber, delivery, null, type, startDate, endDate, paymentId));
    };

    const handleInvoiceClick = async (orderId) => {
        dispatch(getInvoiceDetails(orderId, false));
        generateOrder(invoice)
        console.log("Datos para Enviar Factura",invoice)
    };

    const handlePaidOrderClick = async (orderId) => {
        dispatch(getPaidOrderDetails(orderId));
        generateInvoiceOrder(paidOrder, " ", true)
        console.log("Datos para Enviar Factura Pagada",paidOrder)
    };

    const handleClearFilters = () => {
        const endDate = new Date(); // Hoy
        const startDate = subDays(endDate, 6); // Hace 6 días
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setStartDate(startDate);
        setEndDate(endDate);
        setPaymentId('');
        setKeyword('');
        setPageNumber(1);
        dispatch(listOrders('', 1, delivery, null, type, startDate, endDate, ''));
    };

    const exportToExcel = () => {
        // Definir las columnas
        const headers = ["ID", "Cliente", "Habitación", "Convenio", "Pagada", "Método Pago", "Total", "Fecha Pago"];
        
        // Mapear los datos de las reservas
        const data = orders.map((order) => ({
            ID: order.id,
            Cliente: order.client && order.client.name ? order.client.name : "Cliente desconocido",
            Habitación: order.table && Array.isArray(order.table) && order.table.length > 0
                ? order.table.map(table => table.name).join(", ")
                : "DOMICILIO",
            Convenio: getAgreementName(order.client.agreementId),
            Pagada: order.isPaid ? "Sí" : "No",
            "Método Pago": order.is_paid ? getPaymentName(order.paymentId) : "No",
            Total: order.total,
            "Fecha Pago": order.createdAt,
        }));

        // Crear una hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    
        // Ajustar los anchos de columna
        const colWidths = headers.map(header => ({ wch: header.length + 5 }));
        ws['!cols'] = colWidths;
    
        // Crear el libro y añadir la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ordenes");
    
        // Descargar el archivo
        XLSX.writeFile(wb, "ordenes.xlsx");
    };

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
                        <td>
                        <button
                                onClick={() => handleInvoiceClick(order.id)}
                                className="btn btn-warning btn-lg"
                            >
                                Órden
                            </button>
                        </td>
                        {order.isPaid && (
                        <td>
                        <button
                                onClick={() => handlePaidOrderClick(order.id)}
                                className="btn btn-info btn-lg"
                            >
                                Factura
                            </button>
                        </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );

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
                        exportToExcel={exportToExcel}
                    />
                
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title" style={{ margin: 0 }}>Todas las órdenes</h3>
                <div className="card-tools" style={{ marginLeft: 'auto' }}> 
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
                {renderTotals()}
                    <div className="row">
                        <div className="col-12">
                            {renderOrders()}
                            <hr />
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