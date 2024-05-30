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
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import HeaderContent from '../../components/HeaderContent';
import LoaderHandler from '../../components/loader/LoaderHandler';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import addDays from 'date-fns/addDays';
import addSeconds from 'date-fns/addSeconds';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';

const IngredientMovementScreen = ({ history }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState('');
    const [keyword, setKeyword] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const dispatch = useDispatch();

    const ingredientMovementList = useSelector((state) => state.ingredientMovementList);
    const { loading, error, movements, page, pages } = ingredientMovementList;

    useEffect(() => {
        dispatch(listIngredientMovements(keyword, pageNumber, startDate, endDate, type));
    }, [dispatch, history, pageNumber, keyword, startDate, endDate, type]);

    const handleFilter = () => {
        dispatch(listIngredientMovements(keyword, pageNumber, startDate, endDate, type));
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movements.map((movement) => (
                        <TableRow key={movement.id}>
                            <TableCell>{movement.id}</TableCell>
                            <TableCell>{movement.ingredient.name}</TableCell>
                            <TableCell>{movement.quantity}</TableCell>
                            <TableCell>{movement.type}</TableCell>
                            <TableCell>{movement.concept}</TableCell>
                            <TableCell>{new Date(movement.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <>
            <HeaderContent name={"Movimientos de Ingredientes"} />
            <section className="content">
                <div className="container-fluid">
                    <div style={{ padding: 16 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                label="Fecha de Inicio"
                                value={startDate}
                                onChange={setStartDate}
                                format="yyyy/MM/dd"
                            />
                            <DatePicker
                                label="Fecha de Fin"
                                value={endDate}
                                onChange={setEndDate}
                                format="yyyy/MM/dd"
                            />
                        </MuiPickersUtilsProvider>
                        <TextField
                            label="Tipo"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            select
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="entrada">Entrada</MenuItem>
                            <MenuItem value="salida">Salida</MenuItem>
                        </TextField>
                        <Button onClick={handleFilter} variant="contained" color="primary">
                            Filtrar
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
