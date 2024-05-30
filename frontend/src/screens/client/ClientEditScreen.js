import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    CLIENT_DELETE_RESET,
    CLIENT_DETAILS_RESET,
    CLIENT_UPDATE_RESET,
} from "../../constants/clientConstants";

/* Actions */
import { listClientDetails, updateClient } from "../../actions/clientActions";

const ClientEditScreen = ({ history, match }) => {
    const clientId = parseInt(match.params.id);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState("");

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //client details state
    const clientDetails = useSelector((state) => state.clientDetails);
    const { loading, error, client } = clientDetails;

    //client update state
    const clientUpdate = useSelector((state) => state.clientUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = clientUpdate;

    useEffect(() => {
        //after update redirect to users
        if (successUpdate) {
            dispatch({ type: CLIENT_UPDATE_RESET });
            dispatch({ type: CLIENT_DETAILS_RESET });
            dispatch({ type: CLIENT_DELETE_RESET });

            history.push("/client");
        }

        if (client) {
            //load client data
            if (!client.name || client.id !== clientId) {
                dispatch(listClientDetails(clientId));
            } else {
                //set states
                setName(client.name);
                setAddress(client.address);
                setPhone(client.phone);
                setEmail(client.email);
                setDni(client.dni);
            }
        }
    }, [dispatch, history, clientId, client, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!address) {
            errorsCheck.address = "Dirección es requerida";
        }

        if (!phone) {
            errorsCheck.phone = "Teléfono es requerido";
        }
        if (!email) {
            errorsCheck.email = "Email es requerido.";
        }

        if (!dni) {
            errorsCheck.dni = "CC es requerida";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            dispatch(
                updateClient({
                    id: clientId,
                    name,
                    address,
                    phone,
                    email,
                    dni,
                })
            );
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <Input
                name={"Nombre"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />
            <Input
                name={"Dirección"}
                type={"text"}
                data={address}
                setData={setAddress}
                errors={errors}
            />
            <Input
                name={"Tel"}
                type={"text"}
                data={phone}
                setData={setPhone}
                errors={errors}
            />
            <Input
                name={"Email"}
                type={"email"}
                data={email}
                setData={setEmail}
                errors={errors}
            />
            <Input
                name={"CC"}
                type={"text"}
                data={dni}
                setData={setDni}
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
            <HeaderContent name={"Clientes"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Cliente</h3>
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

export default ClientEditScreen;
