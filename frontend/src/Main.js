import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

/* SCREENS */
import OrderScreen from "./screens/order/OrderScreen";
import DeliveryScreen from "./screens/order/DeliveryScreen";
import OrderCreateScreen from "./screens/order/OrderCreateScreen";
import OrderViewScreen from "./screens/order/OrderViewScreen ";
import ActiveOrdersScreen from "./screens/order/ActiveOrdersScreen";
import OrderEditScreen from "./screens/order/OrderEditScreen";

import TableScreen from "./screens/table/TableScreen";
import TableEditScreen from "./screens/table/TableEditScreen";

import IngredientScreen from "./screens/ingredient/IngredientScreen";
import IngredientMovementScreen from "./screens/ingredient/IngredientMovementScreen";
import IngredientEditScreen from "./screens/ingredient/IngredientEditScreen";

import IngredientEditScreen from "./screens/ingredient/IngredientEditScreen";

import RoomScreen from "./screens/room/RoomScreen";
import RoomEditScreen from "./screens/room/RoomEditScreen";
import ActiveReservationsScreen from "./screens/reservation/ActiveReservationsScreen";
import ReservationScreen from "./screens/reservation/ReservationScreen";
import ReservationCreateScreen from "./screens/reservation/ReservationCreateScreen";
import ReservationEditScreen from "./screens/reservation/ReservationEditScreen";
import ReservationViewScreen from "./screens/reservation/ReservationViewScreen";

import ProductScreen from "./screens/product/ProductScreen";
import ProductEditScreen from "./screens/product/ProductEditScreen";

import ClientScreen from "./screens/client/ClientScreen";
import ClientEditScreen from "./screens/client/ClientEditScreen";

import CategoryScreen from "./screens/category/CategoryScreen";
import CategoryEditScreen from "./screens/category/CategoryEditScreen";

import AgreementScreen from "./screens/agreement/AgreementScreen";
import AgreementEditScreen from "./screens/agreement/AgreementEditScreen";

import UserScreen from "./screens/user/UserScreen";
import UserEditScreen from "./screens/user/UserEditScreen";
import ProfileScreen from "./screens/user/ProfileScreen";

import DashboardScreen from "./screens/DashboardScreen";
import PrivateRoute from "./auth/PrivateRoute";
import NotFoundScreen from "./screens/NotFoundScreen";
import AdminRoute from "./auth/AdminRoute";
import NotAuthorizedScreen from "./screens/NotAuthorizedScreen";

const Main = () => {
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    return (
        <>
            <Header />
            <Menu />

            <div className="content-wrapper">
                <Switch>
                    <PrivateRoute
                        path="/active"
                        exact
                        component={ActiveOrdersScreen}
                    />
                    <PrivateRoute path="/profile" component={ProfileScreen} />
                    <AdminRoute
                        path="/user/:id/edit"
                        component={UserEditScreen}
                    />
                    <AdminRoute path="/user" exact component={UserScreen} />

                    <PrivateRoute
                        path="/category/:id/edit"
                        component={CategoryEditScreen}
                    />
                    <PrivateRoute path="/category" component={CategoryScreen} />

                    <PrivateRoute path="/agreement" component={AgreementScreen} />

                    <PrivateRoute
                        path="/agreement/:id/edit"
                        component={AgreementEditScreen}
                    />

                    <PrivateRoute path="/delivery" component={DeliveryScreen} />

                    <PrivateRoute
                        path="/client/:id/edit"
                        component={ClientEditScreen}
                    />

                    <PrivateRoute path="/client" component={ClientScreen} />

                    <PrivateRoute
                        path="/ingredient/:id/edit"
                        component={IngredientEditScreen}
                    />

                    <PrivateRoute path="/ingredient" component={IngredientScreen} />
                    
                    <PrivateRoute
                        path="/product/:id/edit"
                        component={ProductEditScreen}
                    />

                    <PrivateRoute path="/product" component={ProductScreen} />

                    <PrivateRoute
                        path="/room/:id/edit"
                        component={RoomEditScreen}
                    />

                    <PrivateRoute path="/room" component={RoomScreen} />

                    <PrivateRoute path="/activeReservation" component={ActiveReservationsScreen} />

                    <PrivateRoute
                        path="/reservation/create/:id/room"
                        component={ReservationCreateScreen}
                    />

                    <PrivateRoute
                        path="/table/:id/edit"
                        component={TableEditScreen}
                    />
                    <PrivateRoute path="/table" component={TableScreen} />

                    <PrivateRoute
                        path="/order/create/:id/table"
                        component={OrderCreateScreen}
                    />

                    <PrivateRoute
                        path="/order/:id/edit"
                        component={OrderEditScreen}
                        exact
                    />

                    <PrivateRoute
                        path="/reservation/:id/edit"
                        component={ReservationEditScreen}
                        exact
                    />

                    <PrivateRoute
                        path="/order/:id/view"
                        component={OrderViewScreen}
                        exact
                    />

                    <PrivateRoute
                        path="/reservation/:id/view"
                        component={ReservationViewScreen}
                        exact
                    />

                    <PrivateRoute
                        path="/order/create"
                        component={OrderCreateScreen}
                    />
                    <PrivateRoute path="/order" component={OrderScreen} />
                    <PrivateRoute path="/reservation" component={ReservationScreen} />
                    <PrivateRoute
                        path="/not-authorized"
                        component={NotAuthorizedScreen}
                    />
                    <PrivateRoute
                        path="/ingredientmovements"
                        component={IngredientMovementScreen}
                    />
                    <PrivateRoute path="/" component={DashboardScreen} />
                    <Route component={NotFoundScreen} />
                </Switch>
            </div>
            <Footer />
        </>
    );
};

export default Main;
