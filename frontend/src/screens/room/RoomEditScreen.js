import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import Checkbox from "../../components/form/Checkbox";
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
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //table details state
    const roomDetails = useSelector((state) => state.roomDetails);
    const { loading, error, room } = roomDetails;

    //table update state
    const roomUpdate = useSelector((state) => state.roomUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = roomUpdate;

    useEffect(() => {
        //after update redirect to users
        if (successUpdate) {
            dispatch({ type: ROOM_UPDATE_RESET });
            dispatch({ type: ROOM_DETAILS_RESET });
            dispatch({ type: ROOM_DELETE_RESET });

            history.push("/room");
        }

        //load table data
        if (room) {
            if (!room.name || room.id !== roomId) {
                dispatch(listRoomDetails(roomId));
            } else {
                //set states
                setName(room.name);
                setActiveStatus(room.active_status);
            }
        }
    }, [dispatch, history, roomId, room, successUpdate]);

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
            const roomUpdated = {
                id: roomId,
                name: name,
                active_status: active_status,
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

export default RoomEditScreen;
