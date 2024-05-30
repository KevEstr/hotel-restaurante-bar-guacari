import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";

/* actions */
import { listOrders } from "../../actions/orderActions";

const DeliveryScreen = ({ history }) => {
    const dispatch = useDispatch();

    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;

    useEffect(() => {
        dispatch(listOrders({ keyword, pageNumber, delivery: true }));
    }, [dispatch, history, userInfo, pageNumber, keyword]);

    const renderCreateButton = () => (
        <Link to="/order/create/delivery">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-truck" /> Nuevo domicilio
            </button>
        </Link>
    );

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th className="d-none d-sm-table-cell">Dirección</th>
                    <th className="d-none d-sm-table-cell">Tel</th>
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
