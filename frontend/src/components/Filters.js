// src/components/Filters.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField, MenuItem, Button } from '@material-ui/core';

const Filters = ({ 
    tempStartDate, setTempStartDate, 
    tempEndDate, setTempEndDate, 
    paymentId, setPaymentId, 
    handleFilter, handleClearFilters ,
    exportToExcel
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: 5 }}>
                <label style={{ marginBottom: 4 }}>Fecha de Inicio</label>
                <DatePicker
                    selected={tempStartDate}
                    onChange={(date) => setTempStartDate(date)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Fecha de Inicio"
                    style={{ width: '150px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8 }}>
                <label style={{ marginBottom: 4 }}>Fecha de Fin</label>
                <DatePicker
                    selected={tempEndDate}
                    onChange={(date) => setTempEndDate(date)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Fecha de Fin"
                    style={{ width: '120px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8 }}>
                <label style={{ marginBottom: 4 }}>Tipo</label>
                <TextField
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    select
                    style={{ minWidth: 120 }}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="3">Efectivo</MenuItem>
                    <MenuItem value="2">Transferencia</MenuItem>
                    <MenuItem value="1">Crédito</MenuItem>
                </TextField>
            </div>
            <Button onClick={handleFilter} variant="contained" color="warning" style={{ marginRight: 8 }}>
                Filtrar
            </Button>
            <Button onClick={handleClearFilters} variant="contained" color="info">
                Limpiar filtros
            </Button>
            <div style={{ marginLeft: 'auto' }}>
            <Button onClick={exportToExcel} variant="contained" color="primary">
                Generar Informe
            </Button>
            </div>
        </div>
        
    );
};

export default Filters;
