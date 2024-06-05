import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    SERVICE_UPDATE_RESET,
    SERVICE_DETAILS_RESET,
    SERVICE_DELETE_RESET,
} from "../../constants/serviceConstants";

/* Actions */
import { listServiceDetails, updateService } from "../../actions/serviceActions";

const ServiceEditScreen = ({ history, match }) => {

    const serviceId = parseInt(match.params.id);
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //table details state
    const serviceDetails = useSelector((state) => state.serviceDetails);
    const { loading, error, service } = serviceDetails;

    //table update state
    const serviceUpdate = useSelector((state) => state.serviceUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = serviceUpdate;

    useEffect(() => {
        //after update redirect to users
        if (successUpdate) {
            dispatch({ type: SERVICE_UPDATE_RESET });
            dispatch({ type: SERVICE_DETAILS_RESET });
            dispatch({ type: SERVICE_DELETE_RESET });

            history.push("/service");
        }

        //load table data
        if (service) {
            if (!service.name || service.id !== serviceId) {
                dispatch(listServiceDetails(serviceId));
            } else {
                //set states
                setName(service.name);
            }
        }
    }, [dispatch, history, serviceId, service, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const serviceUpdated = {
                id: serviceId,
                name: name,
            };
            dispatch(updateService(serviceUpdated));
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <Input
                name={"nombre"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />

            <hr />
            <button type="submit" className="btn btn-success">
                Confirmar
            </button>
        </form>
    );

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Habitaciones"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Habitaciones</h3>
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

export default ServiceEditScreen;
