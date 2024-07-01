import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Input from "../../components/form/Input";
import ButtonGoBack from "../../components/ButtonGoBack";


/* Constants */
import {
    LAUNDRY_UPDATE_RESET,
    LAUNDRY_DETAILS_RESET,
    LAUNDRY_DELETE_RESET,
} from "../../constants/laundryConstants";

/* Actions */
import {
    updateLaundry,
    listLaundriesDetails,
} from "../../actions/laundryActions";
import LoaderHandler from "../../components/loader/LoaderHandler";


const LaundryEditScreen = ({ history, match }) => {
    const laundryId = parseInt(match.params.id);

    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //category details state
    const laundryDetails = useSelector((state) => state.laundryDetails);
    const { loading, error, laundry } = laundryDetails;

    //category update state
    const laundryUpdate = useSelector((state) => state.laundryUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = laundryUpdate;

    useEffect(() => {
        //after update redirect to users
        if (successUpdate) {
            dispatch({ type: LAUNDRY_UPDATE_RESET });
            dispatch({ type: LAUNDRY_DETAILS_RESET });
            dispatch({ type: LAUNDRY_DELETE_RESET });
            history.push("/laundry");
        }

        //load product data
        if (laundry) {
            if (!laundry.quantity || laundry.id !== laundryId) {
                dispatch(listLaundriesDetails(laundryId));
            } else {
                //set states
                setQuantity(laundry.quantity);
                setPrice(laundry.price);
            }
        }
    }, [dispatch, history, laundryId, laundry, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsCheck = {};

        if (!quantity) {
            errorsCheck.name = "Cantidad es requerida";
        }

        if (!price) {
            errorsCheck.name = "Precio es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            dispatch(
                updateLaundry({
                    id: laundryId,
                    quantity,
                    price,
                })
            );
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
           Selecciona el cliente:
                <div className="row">
                    <div className="col-md-6">
                        <Input
                            name={"cantidad"}
                            type={"text"}
                            data={quantity}
                            setData={setQuantity}
                            errors={errors}
                        />
                    </div>
                    <div className="col-md-6">
                        <Input
                            name={"precio"}
                            type={"text"}
                            data={price}
                            setData={setPrice}
                            errors={errors}
                        />
                    </div>
                </div>

            <hr />
            <button type="submit" className="btn btn-success">
                Confirmar
            </button>
        </form>
    );

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Categorias"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Editar Lavandería
                                    </h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <LoaderHandler
                                        loading={loadingUpdate}
                                        error={errorUpdate}
                                    />
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        render={renderForm}
                                    />
                                </div>
                                {/* /.card-body */}
                            </div>
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

export default LaundryEditScreen;
