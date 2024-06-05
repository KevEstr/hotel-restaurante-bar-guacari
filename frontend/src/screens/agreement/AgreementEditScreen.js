import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Input from "../../components/form/Input";
import ButtonGoBack from "../../components/ButtonGoBack";

/* Constants */
import {
    AGREEMENT_UPDATE_RESET,
    AGREEMENT_DETAILS_RESET,
    AGREEMENT_DELETE_RESET,
} from "../../constants/agreementConstants";

/* Actions */
import {
    updateAgreement,
    listAgreementDetails,
} from "../../actions/agreementActions";
import LoaderHandler from "../../components/loader/LoaderHandler";

const AgreementEditScreen = ({ history, match }) => {

    const agreementId = parseInt(match.params.id);
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");

    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    
    //category details state
    const agreementDetails = useSelector((state) => state.agreementDetails);
    const { loading, error, agreement } = agreementDetails;

    //category update state
    const agreementUpdate = useSelector((state) => state.agreementUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = agreementUpdate;

    useEffect(() => {
        //after update redirect to users
        if (successUpdate) {
            dispatch({ type: AGREEMENT_UPDATE_RESET });
            dispatch({ type: AGREEMENT_DETAILS_RESET });
            dispatch({ type: AGREEMENT_DELETE_RESET });
            history.push("/agreement");
        }

        //load product data
        if (agreement) {
            if (!agreement.name || agreement.id !== agreementId) {
                dispatch(listAgreementDetails(agreementId));
            } else {
                //set states
                setName(agreement.name);
                setUserId(agreement.user_id);
            }
        }
    }, [dispatch, history, agreementId, agreement, successUpdate]);

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
            dispatch(
                updateAgreement({
                    id: agreementId,
                    name,
                    user_id: userId,
                })
            );
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
            <HeaderContent name={"Convenios"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Editar Convenio
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

export default AgreementEditScreen;
