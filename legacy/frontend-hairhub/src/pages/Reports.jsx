import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faCalendarAlt, faUsers, 
    faScissors, faFileDownload, faFilter, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import '../styles/Reports.css';

const Reports = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('barber');
    
    // Estados para los filtros de fecha
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Estados para los datos de los informes
    const [barberAppointments, setBarberAppointments] = useState([]);
    const [weekdayStats, setWeekdayStats] = useState([]);
    const [topServices, setTopServices] = useState([]);
    
    // Colores para los gráficos
    const COLORS = ['#36BFB1', '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#da70d6', '#8a2be2'];
    
    // Mover fetchReportData fuera del useEffect para evitar el warning
    const fetchReportData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            
            // Construir parámetros de filtro
            const dateParams = new URLSearchParams();
            if (startDate) dateParams.append('startDate', startDate);
            if (endDate) dateParams.append('endDate', endDate);
            const queryParams = dateParams.toString() ? `?${dateParams.toString()}` : '';
            
            // Fetch barber appointments data
            const barberResponse = await fetch(`http://localhost:8080/api/reports/barbers${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!barberResponse.ok) {
                throw new Error('Error al cargar los datos de barberos');
            }
            
            // Fetch weekday stats
            const weekdayResponse = await fetch(`http://localhost:8080/api/reports/weekdays${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!weekdayResponse.ok) {
                throw new Error('Error al cargar los datos por día de semana');
            }
            
            // Fetch top services
            const servicesResponse = await fetch(`http://localhost:8080/api/reports/services${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!servicesResponse.ok) {
                throw new Error('Error al cargar los datos de servicios');
            }
            
            // Procesar los datos recibidos
            const barberData = await barberResponse.json();
            const weekdayData = await weekdayResponse.json();
            const servicesData = await servicesResponse.json();
            
            // Formatear datos para los gráficos
            const formattedBarberData = barberData.map(item => ({
                name: `${item.nombreBarbero} ${item.apellidoBarbero}`,
                appointments: item.totalCitas,
                revenue: item.ingresoTotal
            }));
            
            const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const formattedWeekdayData = weekdayData.map(item => ({
                name: daysOfWeek[item.diaSemana - 1],
                appointments: item.totalCitas,
                percentage: item.porcentaje
            }));
            
            const formattedServicesData = servicesData.map(item => ({
                name: item.nombreServicio,
                value: item.cantidad,
                revenue: item.ingresoTotal
            }));
            
            setBarberAppointments(formattedBarberData);
            setWeekdayStats(formattedWeekdayData);
            setTopServices(formattedServicesData);
            
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error al cargar los informes');
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate, navigate]);
    
    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);
    
    const handleDateFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };
    
    const applyFilters = (e) => {
        e.preventDefault();
        fetchReportData();
    };
    
    const exportToCSV = (data, filename) => {
        // Convertir los datos a formato CSV
        const csvRows = [];
        
        // Obtener los encabezados (keys de la primera fila)
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
        
        // Convertir cada fila de datos a CSV
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                // Manejar valores que podrían contener comas
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        }
        
        // Crear un blob y descargar el archivo
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    const exportToExcel = (data, filename, title) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title);
        
        // Definir encabezados (primera fila) según la pestaña activa
        let headers = [];
        let columnWidths = {};
        
        switch (activeTab) {
            case 'barber':
                headers = ['Barbero', 'Citas', 'Ingresos ($)'];
                columnWidths = { A: 25, B: 15, C: 15 };
                break;
            case 'weekday':
                headers = ['Día de la Semana', 'Citas', 'Porcentaje (%)'];
                columnWidths = { A: 25, B: 15, C: 20 };
                break;
            case 'services':
                headers = ['Servicio', 'Cantidad', 'Ingresos ($)'];
                columnWidths = { A: 30, B: 15, C: 15 };
                break;
            default:
                headers = Object.keys(data[0]);
                break;
        }
        
        // Añadir título en la parte superior
        worksheet.mergeCells('A1:C1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = title;
        titleCell.font = {
            name: 'Arial',
            size: 16,
            bold: true,
            color: { argb: '36BFB1' }
        };
        titleCell.alignment = { horizontal: 'center' };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2A2A2A' }
        };
        
        // Añadir fila para la fecha de generación
        worksheet.mergeCells('A2:C2');
        const dateCell = worksheet.getCell('A2');
        dateCell.value = `Generado: ${new Date().toLocaleString()}`;
        dateCell.font = {
            name: 'Arial',
            italic: true,
            size: 10,
            color: { argb: 'CCCCCC' }
        };
        dateCell.alignment = { horizontal: 'center' };
        dateCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '1E1E1E' }
        };
        
        // Añadir encabezados de columna (fila 3)
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '36BFB1' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Añadir datos
        data.forEach((item) => {
            let rowData = [];
            
            switch (activeTab) {
                case 'barber':
                    rowData = [item.name, item.appointments, item.revenue];
                    break;
                case 'weekday':
                    rowData = [item.name, item.appointments, item.percentage.toFixed(2) + '%'];
                    break;
                case 'services':
                    rowData = [item.name, item.value, item.revenue];
                    break;
                default:
                    rowData = Object.values(item);
                    break;
            }
            
            const row = worksheet.addRow(rowData);
            
            // Dar formato a las celdas de datos
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                // Formatear celdas de números
                if (colNumber === 3) { // Columna de ingresos o porcentaje
                    if (activeTab === 'barber' || activeTab === 'services') {
                        cell.numFmt = '$#,##0';
                    }
                }
                
                cell.border = {
                    top: { style: 'thin', color: { argb: 'E0E0E0' } },
                    left: { style: 'thin', color: { argb: 'E0E0E0' } },
                    bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
                    right: { style: 'thin', color: { argb: 'E0E0E0' } }
                };
                
                // Filas alternas con color de fondo diferente
                if (row.number % 2 === 0) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F0F0F0' }
                    };
                }
                
                cell.alignment = { vertical: 'middle' };
                if (colNumber > 1) {
                    cell.alignment.horizontal = 'center';
                }
            });
        });
        
        // Establecer anchos de columna
        Object.keys(columnWidths).forEach(col => {
            worksheet.getColumn(col).width = columnWidths[col];
        });
        
        // Añadir fila de totales
        const totalRow = worksheet.addRow(['TOTAL']);
        totalRow.font = { bold: true };
        
        switch (activeTab) {
            case 'barber': {
                const totalAppointments = data.reduce((sum, item) => sum + item.appointments, 0);
                const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
                totalRow.getCell(2).value = totalAppointments;
                totalRow.getCell(3).value = totalRevenue;
                totalRow.getCell(3).numFmt = '$#,##0';
                break;
            }
            case 'weekday': {
                const totalAppointments = data.reduce((sum, item) => sum + item.appointments, 0);
                totalRow.getCell(2).value = totalAppointments;
                totalRow.getCell(3).value = '100%';
                break;
            }
            case 'services': {
                const totalServices = data.reduce((sum, item) => sum + item.value, 0);
                const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
                totalRow.getCell(2).value = totalServices;
                totalRow.getCell(3).value = totalRevenue;
                totalRow.getCell(3).numFmt = '$#,##0';
                break;
            }
            default: {
                // Caso por defecto - maneja pestañas no reconocidas
                console.warn(`Pestaña no reconocida: ${activeTab}`);
                totalRow.getCell(2).value = 0;
                totalRow.getCell(3).value = 0;
                break;
            }
        }
        
        // Dar formato a la fila de totales
        totalRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '36BFB1' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' }
            };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
        });
        
        // Exportar el archivo
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${filename}.xlsx`);
        });
    };
    
    // Renderizar diferentes gráficos según la pestaña activa
    const renderReport = () => {
        switch(activeTab) {
            case 'barber':
                return (
                    <div className="report-card">
                        <div className="report-header">
                            <h3>Citas por Barbero</h3>
                            <button 
                                className="btn btn-outline-light export-btn"
                                onClick={() => exportToCSV(barberAppointments, 'citas_por_barbero')}
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                Exportar CSV
                            </button>
                            <button 
                                className="btn btn-outline-light export-btn"
                                onClick={() => exportToExcel(barberAppointments, 'citas_por_barbero', 'Informe de Citas por Barbero')}
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                Exportar a Excel
                            </button>
                        </div>
                        <div className="report-description">
                            Este informe muestra el número total de citas atendidas por cada barbero y los ingresos generados.
                        </div>
                        <div className="chart-container">
                            {barberAppointments.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={barberAppointments}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                        <XAxis 
                                            dataKey="name" 
                                            tick={{ fill: '#ccc' }} 
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            interval={0} // Mostrar todas las etiquetas
                                        />
                                        <YAxis tick={{ fill: '#ccc' }} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #444' }} 
                                            labelStyle={{ color: '#36BFB1' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="appointments" name="Número de Citas" fill="#36BFB1" />
                                        <Bar dataKey="revenue" name="Ingresos ($)" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-message">
                                    No hay datos disponibles para el período seleccionado.
                                </div>
                            )}
                        </div>
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Barbero</th>
                                        <th>Citas</th>
                                        <th>Ingresos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {barberAppointments.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.appointments}</td>
                                            <td>${item.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                
            case 'weekday':
                return (
                    <div className="report-card">
                        <div className="report-header">
                            <h3>Citas por Día de la Semana</h3>
                            <button 
                                className="btn btn-outline-light export-btn"
                                onClick={() => exportToCSV(weekdayStats, 'citas_por_dia')}
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                Exportar CSV
                            </button>
                            <button 
                                className="btn btn-outline-light export-btn"
                                onClick={() => exportToExcel(weekdayStats, 'citas_por_dia', 'Informe de Citas por Día de la Semana')}
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                Exportar a Excel
                            </button>
                        </div>
                        <div className="report-description">
                            Este informe muestra la distribución de citas por día de la semana, ayudando a identificar los días más ocupados.
                        </div>
                        <div className="chart-container">
                            {weekdayStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={weekdayStats}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                        <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                                        <YAxis tick={{ fill: '#ccc' }} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #444' }} 
                                            labelStyle={{ color: '#36BFB1' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="appointments" name="Número de Citas" fill="#36BFB1" />
                                        <Bar dataKey="percentage" name="Porcentaje (%)" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-message">
                                    No hay datos disponibles para el período seleccionado.
                                </div>
                            )}
                        </div>
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Día</th>
                                        <th>Citas</th>
                                        <th>Porcentaje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weekdayStats.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.appointments}</td>
                                            <td>{item.percentage.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                
            case 'services':
                return (
                    <div className="report-card">
                        <div className="report-header">
                            <h3>Servicios Más Populares</h3>
                            <button 
                                className="btn btn-outline-light export-btn"
                                onClick={() => exportToCSV(topServices, 'servicios_populares')}
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                Exportar CSV
                            </button>
                            <button 
                                className="btn btn-outline-light export-btn"
                                onClick={() => exportToExcel(topServices, 'servicios_populares', 'Informe de Servicios Más Populares')}
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                                Exportar a Excel
                            </button>
                        </div>
                        <div className="report-description">
                            Este informe muestra los servicios más solicitados y el ingreso generado por cada uno.
                        </div>
                        <div className="charts-container dual-chart">
                            {topServices.length > 0 ? (
                                <>
                                    <div className="pie-chart-container">
                                        <h4>Distribución de Servicios</h4>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={topServices}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {topServices.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #444', color:'white' }} 
                                                    itemStyle={{ color: 'white' }} 
                                                    labelStyle={{ color: 'white' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="bar-chart-container">
                                        <h4>Ingresos por Servicio</h4>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                data={topServices}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                <XAxis 
                                                    dataKey="name" 
                                                    tick={{ fill: '#ccc' }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={70}
                                                />
                                                <YAxis tick={{ fill: '#ccc' }} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #444' }} 
                                                    labelStyle={{ color: '#36BFB1' }}
                                                />
                                                <Legend />
                                                <Bar dataKey="revenue" name="Ingresos" fill="#36BFB1" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            ) : (
                                <div className="no-data-message">
                                    No hay datos disponibles para el período seleccionado.
                                </div>
                            )}
                        </div>
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Servicio</th>
                                        <th>Cantidad</th>
                                        <th>Ingresos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topServices.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.value}</td>
                                            <td>${item.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                
            default:
                console.warn('Tab no reconocido:', activeTab);
                return <div>Selecciona un informe para visualizar</div>;
        }
    };
    
    return (
        <div className="reports-container">
            <div className="reports-header">
                <button
                    className="btn btn-outline-light back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Volver
                </button>
                <h2 className='reports-title'>Informes y Estadísticas</h2>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="reports-content">
                <div className="reports-sidebar">
                    <div className="filters-section">
                        <h3>Filtros</h3>
                        <form onSubmit={applyFilters}>
                            <div className="filter-group">
                                <label>Fecha Inicio:</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    name="startDate"
                                    value={startDate}
                                    onChange={handleDateFilterChange}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Fecha Fin:</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    name="endDate"
                                    value={endDate}
                                    onChange={handleDateFilterChange}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary filter-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="me-2" spin />
                                        Cargando...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faFilter} className="me-2" />
                                        Aplicar Filtros
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="reports-nav">
                        <h3>Informes</h3>
                        <ul>
                            <li 
                                className={activeTab === 'barber' ? 'active' : ''} 
                                onClick={() => setActiveTab('barber')}
                            >
                                <FontAwesomeIcon icon={faUsers} className="me-2" />
                                Citas por Barbero
                            </li>
                            <li 
                                className={activeTab === 'weekday' ? 'active' : ''} 
                                onClick={() => setActiveTab('weekday')}
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                Citas por Día de la Semana
                            </li>
                            <li 
                                className={activeTab === 'services' ? 'active' : ''} 
                                onClick={() => setActiveTab('services')}
                            >
                                <FontAwesomeIcon icon={faScissors} className="me-2" />
                                Servicios Más Populares
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="reports-main">
                    {isLoading ? (
                        <div className="loading-container">
                            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
                            <p>Cargando datos...</p>
                        </div>
                    ) : (
                        renderReport()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;