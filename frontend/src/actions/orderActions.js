import axios from "axios";
import {
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_UPDATE_REQUEST,
    ORDER_UPDATE_SUCCESS,
    ORDER_UPDATE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_FAIL,
    ORDER_STATISTICS_REQUEST,
    ORDER_STATISTICS_SUCCESS,
    ORDER_STATISTICS_FAIL,
    CLIENT_ORDER_LIST_REQUEST,
    CLIENT_ORDER_LIST_SUCCESS,
    CLIENT_ORDER_LIST_FAIL,
    CLIENT_ORDERS_REQUEST,
    CLIENT_ORDERS_SUCCESS,
    CLIENT_ORDERS_FAIL,
    TABLE_UPDATE_REQUEST,
    TABLE_UPDATE_SUCCESS,
    TABLE_UPDATE_FAIL

} from "../constants/orderConstants";

import { 
    PRODUCT_DETAILS_REQUEST, 
    PRODUCT_DETAILS_SUCCESS, 
    PRODUCT_DETAILS_FAIL 
} from '../constants/productConstants';

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/products/${id}`);

        dispatch({ 
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data 
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
};

//get all sales
export const getStatistics = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_STATISTICS_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //get all sales
        const { data } = await axios.get(`/api/orders/statistics`, config);

        dispatch({
            type: ORDER_STATISTICS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_STATISTICS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

/*export const listOrdersByClient = (clientId) => async (dispatch, getState) => {
    dispatch(listOrders({ clientId }));
};*/

export const listOrdersByClient = (clientId) => async (dispatch, getState) => {
    try {
        dispatch({ type: CLIENT_ORDER_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/allorder/${clientId}`, config);

        dispatch({
            type: CLIENT_ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CLIENT_ORDER_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

//get all orders with pagination
export const listOrders = (keyword='', pageNumber='', delivery='', clientId='', type='', startDate='', endDate='', paymentId='') => async (dispatch, getState) => {
    //const { keyword, pageNumber, delivery, clientId, type, startDate, endDate, paymentId } = options;
    //console.log("OPTIONS ACTIONS: ",options);
    try {
        dispatch({
            type: ORDER_LIST_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Construct query params
        let query = `/api/orders/?type=${type}`;
        if (keyword) query += `&keyword=${keyword}`;
        if (pageNumber) query += `&pageNumber=${pageNumber}`;
        if (delivery) query += `&delivery=true`;
        if (clientId) query += `&clientId=${clientId}`;
        if (startDate) query += `&startDate=${startDate}`;
        if (endDate) query += `&endDate=${endDate}`;
        if (paymentId) query += `&paymentId=${paymentId}`;


        const { data } = await axios.get(`/api/orders`,{
            params: { keyword, pageNumber, delivery, clientId, type, startDate, endDate, paymentId },
            ...config,
        });

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
        dispatch({
            type: "ORDER_LIST_BY_CLIENT_SUCCESS",
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });

        dispatch({
            type: "ORDER_LIST_BY_CLIENT_FAIL",
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//create a order
export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        //get order from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //create order
        const { data } = await axios.post("/api/orders", order, config);
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });

        return data;
        
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get order details
export const listOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //api call to get ORDER
        const { data } = await axios.get(`/api/orders/${id}`, config);
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a order
export const updateOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_UPDATE_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //update order
        const { data } = await axios.put(
            `/api/orders/${order.id}`,
            order,
            config
        );
        dispatch({
            type: ORDER_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
        console.error("Error actualizando la orden:", error.response && error.response.data ? error.response.data : error.message);

    }
};

//update a order
export const updateOrderToPaid = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_UPDATE_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        //update order
        const { data } = await axios.post(
            `/api/orders/${order.id}/pay`,
            order,
            config
        );
        dispatch({
            type: ORDER_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete order
export const deleteOrder = (orderId, reason) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_DELETE_REQUEST,
      });

      console.log('Enviando solicitud DELETE al backend');

      const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
            },
        };

      // Enviar la solicitud para eliminar la orden
      const { data } = await axios.delete(`/api/orders/${orderId}`,  {
        data: { reason, concept: reason, deletedBy: userInfo.id }, ...config
      });
  
      dispatch({
        type: ORDER_DELETE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ORDER_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      }); 
    }
  };

export const listOrdersClient = (clientId) => async (dispatch, getState) => {
    try {
        dispatch({ type: CLIENT_ORDERS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        //const { data } = await axios.get(`/api/orders/client/${clientId}`, config);
        const { data } = await axios.get(`/api/orders/reservation/${clientId}`, config);
        // Aquí puedes modificar la estructura de los datos para incluir los detalles de los productos asociados a cada orden
        console.log("DATA: ",data);
    

        dispatch({
            type: CLIENT_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: CLIENT_ORDERS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};



