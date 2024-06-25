import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Select from "../../components/Select";
import Message from "../../components/Message";


/* Constants */
import {
    CLIENT_DELETE_RESET,
    CLIENT_DETAILS_RESET,
    CLIENT_UPDATE_RESET,
} from "../../constants/clientConstants";

/* Actions */
import { listClientDetails, updateClient } from "../../actions/clientActions";

import { listAgreements } from "../../actions/agreementActions";

const ClientEditScreen = ({ history, match }) => {
    const clientId = parseInt(match.params.id);

    const [name, setName] = useState("");
    const [lastnames, setLastNames] = useState("");
    const [phone, setPhone] = useState("");
    const [dni, setDni] = useState("");
    const [agreementId, setAgreementId] = useState("");


    const agreementFromUrl = window.location.href.indexOf("agreement") !== -1;

    const [agreement, setAgreement] = useState(
        agreementFromUrl ? parseInt(match.params.id) : null
    );

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //client details state
    const clientDetails = useSelector((state) => state.clientDetails);
    const { loading, error, client } = clientDetails;

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

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
                setLastNames(client.lastnames);
                setPhone(client.phone);
                setAgreementId(client.agreementId);
                setDni(client.dni);
            }
        }
    }, [dispatch, history, clientId, client, successUpdate]);

    const searchAgreements = (e) => {
        dispatch(listAgreements(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }

        if (!phone) {
            errorsCheck.phone = "Teléfono es requerido";
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
                    lastnames,
                    phone,
                    dni,
                    agreementId,
                })
            );
        }
    };

    const renderAgreementsSelect = () => (
        <Select
            data={agreementId}
            setData={setAgreementId}
            items={agreements}
            search={searchAgreements}
        />
    );

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
                name={"Apellidos"}
                type={"text"}
                data={lastnames}
                setData={setLastNames}
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
                name={"CC"}
                type={"text"}
                data={dni}
                setData={setDni}
                errors={errors}
            />
            <div style={{ flex: '1 1 45%' }}>
                        <label style={{fontWeight: 'normal'}}>Convenio:</label>
                        {renderAgreementsSelect()}
                        {errors.agreement && (
                            <Message message={errors.agreement} color={"warning"} />
                        )}
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
