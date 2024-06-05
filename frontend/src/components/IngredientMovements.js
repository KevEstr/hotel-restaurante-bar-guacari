// components/IngredientMovements.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listIngredientMovements } from '../actions/ingredientActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const IngredientMovements = () => {
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState('');

    const ingredientMovementsList = useSelector((state) => state.ingredientMovementsList);
    const { loading, error, movements } = ingredientMovementsList;

    useEffect(() => {
        dispatch(listIngredientMovements({ startDate, endDate, type }));
    }, [dispatch, startDate, endDate, type]);

    const handleFilterChange = () => {
        dispatch(listIngredientMovements({ startDate, endDate, type }));
    };

    return (
        <div>
            <h1>Movimientos de Inventario</h1>
            <div className="filters">
                <div className="filter-item">
                    <label>Fecha Inicio</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div className="filter-item">
                    <label>Fecha Fin</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div className="filter-item">
                    <label>Tipo de Movimiento</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Egreso">Egreso</option>
                    </select>
                </div>
                <button onClick={handleFilterChange}>Filtrar</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ingrediente</th>
                            <th>Cantidad</th>
                            <th>Tipo de Movimiento</th>
                            <th>Concepto</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map((movement) => (
                            <tr key={movement._id}>
                                <td>{movement.ingredient.name}</td>
                                <td>{movement.quantity}</td>
                                <td>{movement.type}</td>
                                <td>{movement.concept}</td>
                                <td>{new Date(movement.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IngredientMovements;
