import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createService, getServices } from '../actions/serviceActions';

const ServiceScreen = () => {
    const [name, setName] = useState('');

    const dispatch = useDispatch();

    const serviceList = useSelector((state) => state.serviceList);
    const { services, loading, error } = serviceList;

    const serviceCreate = useSelector((state) => state.serviceCreate);
    const { success: successCreate } = serviceCreate;

    useEffect(() => {
        dispatch(getServices());
    }, [dispatch, successCreate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createService(name));
        setName('');
    };

    return (
        <div>
            <form onSubmit={submitHandler}>
                <input
                    type="text"
                    placeholder="Nombre del Servicio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Crear Servicio</button>
            </form>

            {loading ? (
                <div>Cargando...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <ul>
                    {services.map((service) => (
                        <li key={service.id}>{service.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ServiceScreen;
