import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ModalButton from "../../components/ModalButton";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

/* Actions */
import { createAgreement, listAgreements } from "../../actions/agreementActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

const AgreementScreen = ({ history, match }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [name, setName] = useState("");
    const [max_daily_food, setMaxDailyFood] = useState("");
    const [max_daily_laundry, setMaxDailyLaundry] = useState("");
    const [max_daily_hydration, setMaxDailyHydration] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    const dispatch = useDispatch();

    const agreementList = useSelector((state) => state.agreementList);
    const { loading, error, agreements, page, pages } = agreementList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const agreementCreate = useSelector((state) => state.agreementCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = agreementCreate;

    useEffect(() => {
        dispatch(listAgreements(keyword, pageNumber));

        if (createSuccess) {
            setName("");
            setMaxDailyFood("");
            setMaxDailyLaundry("");
            setMaxDailyHydration("");
            setUserId("");
            setModalIsOpen(false);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess]);

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
            const agreement = {
                name: name,
                max_daily_food: max_daily_food,
                max_daily_laundry: max_daily_laundry,
                max_daily_hydration: max_daily_hydration,
                userId: userId,
            };

            dispatch(createAgreement(agreement));
        }
    };

    const renderModalCreateAgreement = () => (
        <>
            <ModalButton
                modal={modalIsOpen}
                setModal={setModalIsOpen}
                classes={"btn-success btn-lg mb-2"}
            />
            <Modal
                style={modalStyles}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <h2>Formulario creación</h2>
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                    <Input
                        name={"nombre"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />

                    <Input
                        name={"Tope de Alimentación:"}
                        type={"number"}
                        data={max_daily_food}
                        setData={setMaxDailyFood}
                        errors={errors}
                    />

                    <Input
                        name={"Tope de Lavanderia:"}
                        type={"number"}
                        data={max_daily_laundry}
                        setData={setMaxDailyLaundry}
                        errors={errors}
                    />

                    <Input
                        name={"Tope de Hidratación:"}
                        type={"number"}
                        data={max_daily_hydration}
                        setData={setMaxDailyHydration}
                        errors={errors}
                    />

                    <hr />
                    <button type="submit" className="btn btn-primary">
                        Confirmar
                    </button>

                    <ModalButton
                        modal={modalIsOpen}
                        setModal={setModalIsOpen}
                        classes={"btn-danger float-right"}
                    />
                </form>
            </Modal>
        </>
    );

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Convenio</th>
                    <th>Tope de Alimentación:</th>
                    <th>Tope de Lavanderia:</th>
                    <th>Tope de Hidratación:</th>
                    <th>Usuario</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {agreements.map((agreement) => (
                    <tr key={agreement.id}>
                        <td>{agreement.id}</td>
                        <td>{agreement.name}</td>
                        <td>{agreement.max_daily_food}</td>
                        <td>{agreement.max_daily_laundry}</td>
                        <td>{agreement.max_daily_hydration}</td>
                        <td>{agreement.userId}</td>


                        <td className="d-none d-sm-table-cell">
                            {agreement.createdAt.slice(0, 10)}
                        </td>
                        <td>
                            <Link
                                to={`/agreement/${agreement.id}/edit`}
                                className="btn btn-warning btn-lg"
                            >
                                Editar
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <HeaderContent name={"Convenios"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateAgreement()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Convenios</h3>
                                    <div className="card-tools">
                                        <Search
                                            keyword={keyword}
                                            setKeyword={setKeyword}
                                            setPage={setPageNumber}
                                        />
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body table-responsive p-0">
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        loader={<DataTableLoader />}
                                        render={renderTable}
                                    />
                                </div>
                                {/* /.card-body */}
                            </div>

                            <Pagination
                                page={page}
                                pages={pages}
                                setPage={setPageNumber}
                            />
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

export default AgreementScreen;
