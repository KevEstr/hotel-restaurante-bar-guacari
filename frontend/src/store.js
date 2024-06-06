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
} from "./reducers/userReducers";

import {
    categoryListReducer,
    categoryCreateReducer,
    categoryDetailsReducer,
    categoryUpdateReducer,
} from "./reducers/categoryReducers";

import {
    agreementListReducer,
    agreementCreateReducer,
    agreementDetailsReducer,
    agreementUpdateReducer,
} from "./reducers/agreementReducers";

import {
    tableAllReducer,
    tableListReducer,
    tableCreateReducer,
    tableDetailsReducer,
    tableUpdateReducer,
} from "./reducers/tableReducers";

import {
    serviceAllReducer,
    serviceListReducer,
    serviceCreateReducer,
    serviceDetailsReducer,
    serviceUpdateReducer,
} from "./reducers/serviceReducers";

import {
    roomListReducer,
    roomCreateReducer,
    roomDetailsReducer,
    roomUpdateReducer,
} from "./reducers/roomReducers";

import {
    clientListReducer,
    clientCreateReducer,
    clientDetailsReducer,
    clientUpdateReducer,
} from "./reducers/clientReducers";

import {
    ingredientListReducer,
    ingredientCreateReducer,
    ingredientDetailsReducer,
    ingredientUpdateReducer,
} from "./reducers/ingredientReducers";

import {
    productListReducer,
    productCreateReducer,
    productDetailsReducer,
    productUpdateReducer,
    productIngredientsReducer,
} from "./reducers/productReducers";

import {
    orderListReducer,
    orderCreateReducer,
    orderDetailsReducer,
    orderUpdateReducer,
    statisticsReducer,
    clientOrdersReducer,
} from "./reducers/orderReducers";

import {
    ingredientMovementListReducer,
    ingredientMovementDetailsReducer,
    ingredientMovementCreateReducer,
    ingredientMovementUpdateReducer,
    ingredientMovementDeleteReducer,
} from './reducers/ingredientMovementReducers';

import { roleListReducer } from './reducers/roleReducers';


  

import{
    reservationListReducer,
    reservationCreateReducer,
    reservationDetailsReducer,
    reservationUpdateReducer,
    clientReservationsReducer
} from "./reducers/reservationReducers";

const reducer = combineReducers({

    roleList: roleListReducer,

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

    categoryList: categoryListReducer,
    categoryCreate: categoryCreateReducer,
    categoryDetails: categoryDetailsReducer,
    categoryUpdate: categoryUpdateReducer,

    agreementList: agreementListReducer,
    agreementCreate: agreementCreateReducer,
    agreementDetails: agreementDetailsReducer,
    agreementUpdate: agreementUpdateReducer,

    ingredientList: ingredientListReducer,
    ingredientCreate: ingredientCreateReducer,
    ingredientDetails: ingredientDetailsReducer,
    ingredientUpdate: ingredientUpdateReducer,

    productList: productListReducer,
    productCreate: productCreateReducer,
    productDetails: productDetailsReducer,
    productUpdate: productUpdateReducer,
    productIngredients: productIngredientsReducer,

    tableAll: tableAllReducer,
    tableList: tableListReducer,
    tableCreate: tableCreateReducer,
    tableDetails: tableDetailsReducer,
    tableUpdate: tableUpdateReducer,

    serviceAll: serviceAllReducer,
    serviceList: serviceListReducer,
    serviceCreate: serviceCreateReducer,
    serviceDetails: serviceDetailsReducer,
    serviceUpdate: serviceUpdateReducer,

    roomList: roomListReducer,
    roomCreate: roomCreateReducer,
    roomDetails: roomDetailsReducer,
    roomUpdate: roomUpdateReducer,

    clientList: clientListReducer,
    clientCreate: clientCreateReducer,
    clientDetails: clientDetailsReducer,
    clientUpdate: clientUpdateReducer,

    orderStatistics: statisticsReducer,
    orderList: orderListReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderUpdate: orderUpdateReducer,

    reservationList: reservationListReducer,
    reservationCreate: reservationCreateReducer,
    reservationDetails: reservationDetailsReducer,
    reservationUpdate: reservationUpdateReducer,
    clientReservations: clientReservationsReducer,
    clientOrders: clientOrdersReducer,

    section: sectionReducer
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
