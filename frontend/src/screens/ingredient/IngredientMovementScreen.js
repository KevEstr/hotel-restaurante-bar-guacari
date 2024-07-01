import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listIngredientMovements } from '../../actions/ingredientMovementActions';
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
//import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HeaderContent from '../../components/HeaderContent';
import LoaderHandler from '../../components/loader/LoaderHandler';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import subDays from 'date-fns/subDays';
import * as XLSX from "xlsx";


const IngredientMovementScreen = ({ history }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);
    const [type, setType] = useState('');
    const [keyword, setKeyword] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const dispatch = useDispatch();
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Verifica si es la primera carga


    const ingredientMovementList = useSelector((state) => state.ingredientMovementList);
    const { loading, error, movements, page, pages } = ingredientMovementList;

    const STORAGE_KEY = 'ingredient_movement_filters';


    useEffect(() => {
        const storedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (storedFilters && storedFilters.startDate && storedFilters.endDate) {
            console.log("storedFilters: ", storedFilters);
            // Si hay filtros almacenados, aplicarlos
            setTempStartDate(new Date(storedFilters.startDate));
            setTempEndDate(new Date(storedFilters.endDate));
            setStartDate(new Date(storedFilters.startDate));
            setEndDate(new Date(storedFilters.endDate));
        } else {
            // Si no hay filtros almacenados, establecer los últimos 7 días
            const endDate = new Date(); // Hoy
            const startDate = subDays(endDate, 6); // Hace 6 días
            setTempStartDate(startDate);
            setTempEndDate(endDate);
            setStartDate(startDate);
            setEndDate(endDate);
        }
    }, []);
    

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ startDate, endDate, type, keyword }));

        if (startDate && endDate) {
            dispatch(listIngredientMovements(keyword, pageNumber, startDate, endDate, type));
        }

    }, [dispatch, history, pageNumber, keyword, startDate, endDate, type]);

    const handleFilter = () => {
        const startOfDay = new Date(tempStartDate);
        startOfDay.setHours(0, 0, 0, 0);
        setStartDate(startOfDay);
        
        const endOfDay = new Date(tempEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        setEndDate(endOfDay);
        dispatch(listIngredientMovements(keyword, pageNumber, startDate, endDate, type));
    };

    const handleClearFilters = () => {
        const endDate = new Date(); // Hoy
        const startDate = subDays(endDate, 6); // Hace 6 días
        setStartDate(startDate);
        setEndDate(endDate);
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setType('');
        setKeyword('');
        setPageNumber(1);
        localStorage.removeItem(STORAGE_KEY);
    };

    const exportToExcel = () => {
        // Definir las columnas
        const headers = ["ID", "Ingrediente", "Cantidad", "Tipo de Movimiento", "Concepto", "Fecha", "Valor", "Usuario"];
    
        // Mapear los datos de los movimientos
        const data = movements.map((movement) => ({
            ID: movement.id,
            Ingrediente: movement.ingredient.name,
            Cantidad: movement.quantity,
            "Tipo de Movimiento": movement.type,
            Concepto: movement.concept,
            Fecha: new Date(movement.createdAt).toLocaleDateString(),
            Valor: movement.totalPrice,
            Usuario: movement.user.name,
        }));
    
        // Crear una hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    
        // Ajustar los anchos de columna
        const colWidths = headers.map(header => ({ wch: header.length + 5 }));
        ws['!cols'] = colWidths;
    
        // Crear el libro y añadir la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
    
        // Descargar el archivo
        XLSX.writeFile(wb, "movimientos.xlsx");
    };

    const renderMovementsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Ingrediente</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Tipo de Movimiento</TableCell>
                        <TableCell>Concepto</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Usuario</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movements.length > 0 ? (
                        movements.map((movement) => (
                            <TableRow key={movement.id}>
                                <TableCell>{movement.id}</TableCell>
                                <TableCell>{movement.ingredient.name}</TableCell>
                                <TableCell>{movement.quantity}</TableCell>
                                <TableCell>{movement.type}</TableCell>
                                <TableCell>{movement.concept}</TableCell>
                                <TableCell>{new Date(movement.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{"$"+ movement.totalPrice}</TableCell>
                                <TableCell>{movement.user.name}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8}>No hay registros para mostrar.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <>
                <HeaderContent name={"Movimientos de Ingredientes"} />
            <section className="content">
                <div className="container-fluid">
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
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                select
                                style={{ minWidth: 120 }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="entrada">Entrada</MenuItem>
                                <MenuItem value="salida">Salida</MenuItem>
                            </TextField>
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
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Movimientos de Ingredientes</h3>
                                    <div className="card-tools">
                                        <Search keyword={keyword} setKeyword={setKeyword} setPage={setPageNumber} />
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <LoaderHandler loading={loading} error={error} loader={<CircularProgress />} render={renderMovementsTable} />
                                </div>
                            </div>
                            <Pagination page={page} pages={pages} setPage={setPageNumber} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default IngredientMovementScreen;
