import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Menu = ({ history }) => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const section = useSelector((state) => state.section?.section);

    useEffect(() => {
        if (!userInfo) {
            redirectTo();
        }
    }, [dispatch, userInfo]);

    const redirectTo = () => {
        return (
            <Redirect
                to={{
                    pathname: "/login",
                    state: { referrer: "/" },
                }}
            />
        );
    };

    const renderMenu = () => {
        if (section === 'hotel') {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">

                    {/* SECCIÓN QUE LE CORRESPONDE AL MENU DEL HOTEL */}
                    <Link to={"/hotel"} className="brand-link">
                        <img
                            src="/guacari.png"
                            alt="Guacarí Logo"
                            className="brand-image img-circle elevation-3"
                            style={{ opacity: ".9" }}
                        />
                        <span className="brand-text font-weight-light">GUACARÍ</span>
                    </Link>
                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Sidebar user panel (optional) */}
                        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div className="image">
                                <img
                                    src={userInfo ? userInfo.image : "/avatar.png"}
                                    className="img-circle elevation-2"
                                    alt="User"
                                />
                            </div>
                            <div className="info">
                                <Link to="/profile" className="d-block">
                                    {userInfo ? userInfo.name : ""}
                                </Link>
                            </div>
                        </div>
                        {/* Sidebar Menu */}
                        <nav className="mt-2">
                            <ul
                                className="nav nav-pills nav-sidebar flex-column"
                                data-widget="treeview"
                                role="menu"
                                data-accordion="false"
                            >
                                <li className="nav-item">
                                    <Link to="/hotel" className="nav-link">
                                        <i className="nav-icon fas fa-tachometer-alt" />{" "}
                                        <p> Dashboard</p>
                                    </Link>
                                </li>

                                {!userInfo ? (
                                    ""
                                ) : userInfo.isAdmin === true ? (
                                    <>
                                        <li className="nav-header">ADMINISTRADOR</li>
                                        <li className="nav-item">
                                            <Link to="/user" className="nav-link">
                                                <i className="nav-icon fas fa-users" />{" "}
                                                <p> Usuarios</p>
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    ""
                                )}

                                <li className="nav-header">SISTEMA HOTELERO</li>
                                <li className="nav-item">
                                    <Link to="/room" className="nav-link">
                                        <i className="nav-icon fas fa-solid fa-bed" />{" "}
                                        <p> Habitaciones </p>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="/activeReservation" className="nav-link">
                                        <i className="nav-icon fas fa-solid fa-calendar-check" />{" "}
                                        <p> Reservas </p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/service" className="nav-link">
                                        <i className="nav-icon fas fa-solid fa-soap" />{" "}
                                        <p> Servicios </p>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="/reservation" className="nav-link">
                                        <i className="nav-icon far fa-clipboard" />{" "}
                                        <p> Historial</p>
                                    </Link>
                                </li>

                                <li className="nav-header">GESTIÓN DEL HOTEL</li>

                                <li className="nav-item">
                                    <Link to="/agreement" className="nav-link">
                                        <i className="nav-icon fas fa-solid fa-people-arrows" />{" "}
                                        <p>Convenios</p>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="/" className="nav-link">
                                        <i className="nav-icon fas fa-solid fa-money-bill" />{" "}
                                        <p>Facturación</p>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="/client" className="nav-link">
                                        <i className="nav-icon fas fa-user" />{" "}
                                        <p> Clientes</p>
                                    </Link>
                                </li>
                    </ul>
                </nav>
                {/* /.sidebar-menu */}
            </div>
            {/* /.sidebar */}
        </aside>
    );
} else {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* SECCIÓN QUE LE CORRESPONDE AL MENU DE RESTAURANTE*/}
        <Link to={"/dashboard"} className="brand-link">
            <img
                src="/guacari.png"
                alt="Guacarí Logo"
                className="brand-image img-circle elevation-3"
                style={{ opacity: ".9" }}
            />
            <span className="brand-text font-weight-light">GUACARÍ</span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                <div className="image">
                    <img
                        src={userInfo ? userInfo.image : "/avatar.png"}
                        className="img-circle elevation-2"
                        alt="User"
                    />
                </div>
                <div className="info">
                    <Link to="/profile" className="d-block">
                        {userInfo ? userInfo.name : ""}
                    </Link>
                </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
                <ul
                    className="nav nav-pills nav-sidebar flex-column"
                    data-widget="treeview"
                    role="menu"
                    data-accordion="false"
                >
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">
                            <i className="nav-icon fas fa-tachometer-alt" />{" "}
                            <p> Dashboard</p>
                        </Link>
                    </li>

                    {!userInfo ? (
                        ""
                    ) : userInfo.isAdmin === true ? (
                        <>
                            <li className="nav-header">ADMINISTRADOR</li>
                            <li className="nav-item">
                                <Link to="/user" className="nav-link">
                                    <i className="nav-icon fas fa-users" />{" "}
                                    <p> Usuarios</p>
                                </Link>
                            </li>
                        </>
                    ) : (
                        ""
                    )}

                    <li className="nav-header">RESTOBAR</li>
                    <li className="nav-item">
                        <Link to="/active" className="nav-link">
                            <i className="nav-icon fas fa-bell" />{" "}
                            <p> Órdenes Activas</p>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/delivery" className="nav-link">
                            <i className="nav-icon fas fa-truck" />{" "}
                            <p> Delivery</p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/order" className="nav-link">
                            <i className="nav-icon far fa-clipboard" />{" "}
                            <p> Historial</p>
                        </Link>
                    </li>

                    <li className="nav-header">GESTIÓN</li>

                    <li className="nav-item">
                        <Link to="/category" className="nav-link">
                            <i className="nav-icon fas fa-list-alt" />{" "}
                            <p> Categorías</p>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/product" className="nav-link">
                            <i className="nav-icon fas fa-hamburger" />{" "}
                            <p> Productos</p>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/ingredient" className="nav-link">
                        <i className="nav-icon fas fa-seedling" />{" "}
                            <p> Ingredientes</p>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/client" className="nav-link">
                            <i className="nav-icon fas fa-user" />{" "}
                            <p> Clientes</p>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/table" className="nav-link">
                            <i className="nav-icon fas fa-border-all" />{" "}
                            <p> Mesas</p>
                        </Link>
                    </li>
                    <li className="nav-header">REPORTES</li>
                    <li className="nav-item">
                        <Link to="/ingredientmovement" className="nav-link">
                            <i className="nav-icon fas fa-border-all" />{" "}
                            <p> Ingredientes</p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/table" className="nav-link">
                            <i className="nav-icon fas fa-border-all" />{" "}
                            <p> Productos</p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/table" className="nav-link">
                            <i className="nav-icon fas fa-border-all" />{" "}
                            <p> Ventas</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
    </aside> 
    )
}
    };

    return (
        <>
            {renderMenu()}
        </>
    );
};

export default Menu;
