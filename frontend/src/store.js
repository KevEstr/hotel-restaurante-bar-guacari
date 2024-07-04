import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { sectionReducer } from './reducers/sectionReducer';

import {
    userLoginReducer,
    userListReducer,
    userRegisterReducer,
    userDetailsReducer,
    userUpdateReducer,
    userDeleteReducer,
} from "./reducers/userReducers";

import {
    categoryListReducer,
    categoryCreateReducer,
    categoryDetailsReducer,
    categoryUpdateReducer,
    categoryDeleteReducer,
} from "./reducers/categoryReducers";

import {
    laundryListReducer,
    laundryCreateReducer,
    laundryDetailsReducer,
    laundryUpdateReducer,
    laundryDeleteReducer,
} from "./reducers/laundryReducers";

import {
    agreementListReducer,
    agreementCreateReducer,
    agreementDetailsReducer,
    agreementUpdateReducer,
    agreementDeleteReducer,
} from "./reducers/agreementReducers";

import {
    tableAllReducer,
    tableListReducer,
    tableCreateReducer,
    tableDetailsReducer,
    tableUpdateReducer,
    tableDeleteReducer
} from "./reducers/tableReducers";

import {
    serviceAllReducer,
    serviceListReducer,
    serviceCreateReducer,
    serviceDetailsReducer,
    serviceUpdateReducer,
    serviceDeleteReducer,
} from "./reducers/serviceReducers";

import {
    roomAllReducer,
    roomListReducer,
    roomCreateReducer,
    roomDetailsReducer,
    roomUpdateReducer,
    roomDeleteReducer
} from "./reducers/roomReducers";

import {
    clientListReducer,
    clientCreateReducer,
    clientDetailsReducer,
    clientUpdateReducer,
    clientDeleteReducer,
} from "./reducers/clientReducers";

import {
    ingredientListReducer,
    ingredientCreateReducer,
    ingredientDetailsReducer,
    ingredientUpdateReducer,
    ingredientDeleteReducer,
} from "./reducers/ingredientReducers";

import {
    productListReducer,
    productCreateReducer,
    productDetailsReducer,
    productUpdateReducer,
    productIngredientsReducer,
    productDeleteReducer,
} from "./reducers/productReducers";

import {
    orderListReducer,
    orderCreateReducer,
    orderDetailsReducer,
    orderUpdateReducer,
    statisticsReducer,
    clientOrdersReducer,
    orderDeleteReducer,
} from "./reducers/orderReducers";

import {
    ingredientMovementListReducer,
    ingredientMovementDetailsReducer,
    ingredientMovementCreateReducer,
    ingredientMovementUpdateReducer,
    ingredientMovementDeleteReducer,
} from './reducers/ingredientMovementReducers';

import { roleListReducer } from './reducers/roleReducers';

import { paymentListReducer } from './reducers/paymentReducers';

import { tableAuditListReducer } from './reducers/tableAuditReducers';

import{
    reservationListReducer,
    reservationCreateReducer,
    reservationDetailsReducer,
    reservationUpdateReducer,
    clientReservationsReducer,
    reservationDeleteReducer,
    reservationAllListReducer,
    ReservationStatisticsReducer
} from "./reducers/reservationReducers";

import{
    invoiceDetailsReducer
} from "./reducers/invoiceReducers";

import{
    paidOrderDetailsReducer
} from "./reducers/paidOrderReducers";

const reducer = combineReducers({

    roleList: roleListReducer,
    paymentList: paymentListReducer,

    ingredientMovementList: ingredientMovementListReducer,
    ingredientMovementDetails: ingredientMovementDetailsReducer,
    ingredientMovementCreate: ingredientMovementCreateReducer,
    ingredientMovementUpdate: ingredientMovementUpdateReducer,
    ingredientMovementDelete: ingredientMovementDeleteReducer,

    userLogin: userLoginReducer,
    userList: userListReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,

    categoryList: categoryListReducer,
    categoryCreate: categoryCreateReducer,
    categoryDetails: categoryDetailsReducer,
    categoryUpdate: categoryUpdateReducer,
    categoryDelete: categoryDeleteReducer,

    laundryList: laundryListReducer,
    laundryCreate: laundryCreateReducer,
    laundryDetails: laundryDetailsReducer,
    laundryUpdate: laundryUpdateReducer,
    laundryDelete: laundryDeleteReducer,

    agreementList: agreementListReducer,
    agreementCreate: agreementCreateReducer,
    agreementDetails: agreementDetailsReducer,
    agreementUpdate: agreementUpdateReducer,
    agreementDelete: agreementDeleteReducer,

    ingredientList: ingredientListReducer,
    ingredientCreate: ingredientCreateReducer,
    ingredientDetails: ingredientDetailsReducer,
    ingredientUpdate: ingredientUpdateReducer,
    ingredientDelete: ingredientDeleteReducer,

    productList: productListReducer,
    productCreate: productCreateReducer,
    productDetails: productDetailsReducer,
    productUpdate: productUpdateReducer,
    productIngredients: productIngredientsReducer,
    productDelete: productDeleteReducer,

    tableAll: tableAllReducer,
    tableList: tableListReducer,
    tableCreate: tableCreateReducer,
    tableDetails: tableDetailsReducer,
    tableUpdate: tableUpdateReducer,
    tableDelete: tableDeleteReducer,

    serviceAll: serviceAllReducer,
    serviceList: serviceListReducer,
    serviceCreate: serviceCreateReducer,
    serviceDetails: serviceDetailsReducer,
    serviceUpdate: serviceUpdateReducer,
    serviceDelete: serviceDeleteReducer,

    roomList: roomListReducer,
    roomCreate: roomCreateReducer,
    roomDetails: roomDetailsReducer,
    roomUpdate: roomUpdateReducer,
    roomAll: roomAllReducer,
    roomDelete: roomDeleteReducer,

    clientList: clientListReducer,
    clientCreate: clientCreateReducer,
    clientDetails: clientDetailsReducer,
    clientUpdate: clientUpdateReducer,
    clientDelete: clientDeleteReducer,

    orderStatistics: statisticsReducer,
    orderList: orderListReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderUpdate: orderUpdateReducer,
    orderDelete: orderDeleteReducer,

    reservationStatistics: ReservationStatisticsReducer,
    reservationAllList: reservationAllListReducer,
    reservationList: reservationListReducer,
    reservationCreate: reservationCreateReducer,
    reservationDetails: reservationDetailsReducer,
    reservationUpdate: reservationUpdateReducer,
    clientReservations: clientReservationsReducer,
    clientOrders: clientOrdersReducer,
    reservationDelete: reservationDeleteReducer,

    section: sectionReducer,

    invoiceDetails: invoiceDetailsReducer,

    paidOrderDetails: paidOrderDetailsReducer,

    tableAuditList: tableAuditListReducer,

});

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
