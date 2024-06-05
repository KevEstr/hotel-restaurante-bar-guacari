import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import Modal from "react-modal";
import Checkbox from "../../components/form/Checkbox";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Actions */
import { listUsers, register } from "../../actions/userActions";
import { listRoles } from "../../actions/roleActions"; // importar la nueva acción
import { allRoles } from "../../actions/roleActions"


/* Styles */
import { modalStyles } from "../../utils/styles";

const UserScreen = ({ history }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    const [roleId, setRoleId] = useState("");


    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userList = useSelector((state) => state.userList);
    const { loading, error, users, page, pages } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userRegister = useSelector((state) => state.userRegister);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = userRegister;

    const roleList = useSelector((state) => state.roleList);
    const { roles } = roleList; // Obtener roles desde el estado


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers(keyword, pageNumber));
            dispatch(listRoles());
        }
        if (createSuccess) {
            setName("");
            setPassword("");
            setEmail("");
            setIsAdmin(false);
            setRoleId('');
            setModalIsOpen(false);
        }
    }, [dispatch, userInfo, pageNumber, keyword, history, createSuccess]);

    useEffect(() => {
        //dispatch(allRoles());
    }, [dispatch, history, userInfo]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};
        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!password) {
            errorsCheck.password = "Contraseña es requerida";
        }

        if (!email) {
            errorsCheck.email = "Email es requerido";
        }

        if (!roleId) {
            errorsCheck.roleId = "Rol es requerido"; // Validar que el rol esté seleccionado
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const user = {
                name: name,
                email: email,
                password: password,
                isAdmin: isAdmin,
                roleId: roleId,
            };

            dispatch(register(user));
        }
    };

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th className="d-none d-sm-table-cell">ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th className="d-none d-sm-table-cell">Foto</th>
                    <th className="d-none d-sm-table-cell">Administrador</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="d-none d-sm-table-cell">{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td className="d-none d-sm-table-cell">
                            <img
                                src={
                                    user.image
                                        ? user.image
                                        : "/dist/img/user2-160x160.jpg"
                                }
                                style={{
                                    height: "2em",
                                }}
                                className="img-circle elevation-2"
                                alt="User"
                            />
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {user.isAdmin ? (
                                <h4 className="text-success">
                                    <i className="fas fa-check"></i>
                                </h4>
                            ) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {user.createdAt.slice(0, 10)}
                        </td>
                        <td>
                            {user.isAdmin ? (
                                ""
                            ) : (
                                <Link
                                    to={`/user/${user.id}/edit`}
                                    className="btn btn-warning btn-lg"
                                >
                                    Editar
                                </Link>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderModalCreateUser = () => (
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
                <h2>Create Form</h2>
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
                        name={"email"}
                        type={"email"}
                        data={email}
                        setData={setEmail}
                        errors={errors}
                    />
                    <Input
                        name={"contraseña"}
                        type={"password"}
                        data={password}
                        setData={setPassword}
                        errors={errors}
                    />
                    <Checkbox
                        name={"Admin"}
                        data={isAdmin}
                        setData={setIsAdmin}
                    />
                      <div className="form-group">
                        <label htmlFor="role">Rol</label>
                        <select
                            id="role"
                            name="role"
                            className="form-control"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                        >
                            <option value="">Seleccione un rol</option>
                            {console.log("ROLES LIST: ",roleList)}
                            {console.log("ROLES: ",roles)}
                            {roles!== undefined && roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        {errors.roleId && <div className="text-danger">{errors.roleId}</div>}
                    </div>

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

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Usuarios"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateUser()}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Tabla de usuarios</h3>
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

export default UserScreen;
