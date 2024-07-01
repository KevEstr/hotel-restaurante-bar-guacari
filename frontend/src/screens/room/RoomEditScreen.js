import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    ROOM_UPDATE_RESET,
    ROOM_DETAILS_RESET,
    ROOM_DELETE_RESET,
} from "../../constants/roomConstants";

/* Actions */
import { listRoomDetails, updateRoom } from "../../actions/roomActions";

const RoomEditScreen = ({ history, match }) => {
    const roomId = parseInt(match.params.id);
    const [name, setName] = useState("");
    const [active_status, setActiveStatus] = useState("");
    const [concept, setConcept] = useState("");
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const roomDetails = useSelector((state) => state.roomDetails);
    const { loading, error, room } = roomDetails;

    const roomUpdate = useSelector((state) => state.roomUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = roomUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: ROOM_UPDATE_RESET });
            dispatch({ type: ROOM_DETAILS_RESET });
            dispatch({ type: ROOM_DELETE_RESET });

            history.push("/room");
        }

        if (room) {
            if (!room.name || room.id !== roomId) {
                dispatch(listRoomDetails(roomId));
            } else {
                setName(room.name);
                setActiveStatus(room.active_status);
                setConcept(room.concept || "");
            }
        }
    }, [dispatch, history, roomId, room, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }

        if (active_status === 2 && !concept) {
            errorsCheck.maintenanceReason = "El concepto de mantenimiento es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const roomUpdated = {
                id: roomId,
                name: name,
                active_status: active_status,
                concept: active_status === 2 ? concept : null,
            };
            dispatch(updateRoom(roomUpdated));
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
            <div className="form-group">
                <label style={{fontWeight: 'normal'}}>Estatus</label>
                <select
                    className="form-control"
                    value={active_status}
                    onChange={(e) => setActiveStatus(parseInt(e.target.value))}
                >
                    <option value={0}>Activo</option>
                    <option value={2}>En mantenimiento</option>
                </select>
            </div>
            {active_status === 2 && (
                <Input
                    name={"Concepto de Mantenimiento"}
                    type={"text"}
                    data={concept}
                    setData={setConcept}
                    errors={errors}
                />
            )}
            <hr />
            <button type="submit" className="btn btn-success">
                Confirmar
            </button>
        </form>
    );

    return (
        <>
            <HeaderContent name={"Habitaciones"} />

            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Habitaciones</h3>
                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RoomEditScreen;
