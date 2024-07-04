import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTableAudits } from '../actions/tableAuditActions';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
} from '@material-ui/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import * as XLSX from "xlsx";

const TableAuditScreen = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const dispatch = useDispatch();

    const tableAuditList = useSelector((state) => state.tableAuditList);
    const { loading, error, audits, page, pages } = tableAuditList;

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(listTableAudits(keyword, pageNumber, startDate, endDate));
        }
    }, [dispatch, keyword, pageNumber, startDate, endDate]);

    const handleFilter = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
    };

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setTempStartDate(null);
        setTempEndDate(null);
        setKeyword('');
        setPageNumber(1);
    };

    const exportToExcel = () => {
        const headers = ["ID", "Usuario", "Orden", "Reserva", "Concepto", "Es Eliminación", "Fecha"];
        const data = audits.map((audit) => ({
            ID: audit.id,
            Usuario: audit.user.name,
            Orden: audit.orderId,
            Reserva: audit.reservationId,
            Concepto: audit.concept,
            "Es Eliminación": audit.is_delete ? "Sí" : "No",
            Fecha: new Date(audit.createdAt).toLocaleDateString(),
        }));
        const ws = XLSX.utils.json_to_sheet(data, { header: headers });
        const colWidths = headers.map(header => ({ wch: header.length + 5 }));
        ws['!cols'] = colWidths;
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Auditoría");
        XLSX.writeFile(wb, "auditoria.xlsx");
    };

    const renderAuditsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Orden</TableCell>
                        <TableCell>Reserva</TableCell>
                        <TableCell>Concepto</TableCell>
                        <TableCell>Es Eliminación</TableCell>
                        <TableCell>Fecha</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {audits.length > 0 ? (
                        audits.map((audit) => (
                            <TableRow key={audit.id}>
                                <TableCell>{audit.id}</TableCell>
                                <TableCell>{audit.user.name}</TableCell>
                                <TableCell>{audit.orderId}</TableCell>
                                <TableCell>{audit.reservationId}</TableCell>
                                <TableCell>{audit.concept}</TableCell>
                                <TableCell>{audit.is_delete ? "Sí" : "No"}</TableCell>
                                <TableCell>{new Date(audit.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>No hay registros para mostrar.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <>
            <div style={{ padding: 16 }}>
                <h1>Auditoría de Órdenes y Reservas</h1>
                <div style={{ display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8 }}>
                        <label>Fecha de Inicio</label>
                        <DatePicker
                            selected={tempStartDate}
                            onChange={(date) => setTempStartDate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Fecha de Inicio"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8 }}>
                        <label>Fecha de Fin</label>
                        <DatePicker
                            selected={tempEndDate}
                            onChange={(date) => setTempEndDate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Fecha de Fin"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8 }}>
                        <label>Palabra Clave</label>
                        <TextField
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Buscar por concepto"
                        />
                    </div>
                    <Button onClick={handleFilter} variant="contained" color="primary" style={{ marginRight: 8 }}>
                        Filtrar
                    </Button>
                    <Button onClick={handleClearFilters} variant="contained" color="secondary" style={{ marginRight: 8 }}>
                        Limpiar filtros
                    </Button>
                    <Button onClick={exportToExcel} variant="contained" color="primary">
                        Exportar Informe
                    </Button>
                </div>
                <div className="table-responsive">
                    {loading ? <CircularProgress /> : error ? <div>{error}</div> : renderAuditsTable()}
                </div>
                <Pagination page={page} pages={pages} setPage={setPageNumber} />
            </div>
        </>
    );
};

export default TableAuditScreen;
