import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const generateInvoiceHistorial = async (invoice, clientOrdersList, clientReservationsList) => {
    if (!Array.isArray(clientOrdersList) || !Array.isArray(clientReservationsList)) {
        console.error('clientOrdersList y clientReservationsList deben ser arrays');
        return;
    }

    const doc = new jsPDF();

    // Función para añadir encabezado de la empresa
    const addCompanyHeader = () => {
        const logo = new Image();
        logo.src = '/factura.png'; // Reemplaza con la ruta correcta a tu logo
        doc.addImage(logo, 'PNG', 10, 10, 30, 30);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.text('Hotel Guacarí', 200, 15, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.text('Cl. 19 #23 71, San Marcos, Sucre', 200, 20, { align: 'right' });
        doc.text('3118901728', 200, 25, { align: 'right' });
        doc.text('guacarihotel@gmail.com', 200, 30, { align: 'right' });
        doc.text('www.guacarihotel.com', 200, 35, { align: 'right' });
        doc.line(10, 45, 200, 45); // Línea separadora
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
    };

    // Función para añadir información del cliente y factura
    const addClientAndInvoiceInfo = (invoice, yOffset = 50) => {
        doc.setFontSize(10);
        doc.setFont("helvetica");
        doc.text('Factura emitida para:', 10, yOffset);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        const clientDetails = JSON.parse(invoice.clientDetails); // Parsear el clienteDetails JSON
        doc.text(clientDetails.name, 10, yOffset + 5);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(clientDetails.address, 10, yOffset + 10);
        doc.text(clientDetails.phone, 10, yOffset + 15);
        doc.text(clientDetails.email, 10, yOffset + 20);
        doc.setFont("helvetica");
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
        doc.text('Factura #:', 200, yOffset, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.text(invoice.id.toString(), 240, yOffset, { align: 'right' });
        doc.text(`Fecha de pago: ${new Date().toLocaleString()}`, 200, yOffset + 5, { align: 'right' });
        doc.text(`Fecha de factura: ${new Date(invoice.invoiceDate).toLocaleString()}`, 200, yOffset + 10, { align: 'right' });
        doc.line(10, yOffset + 25, 200, yOffset + 25); // Línea separadora
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
    };

    // Datos de las órdenes
    const formattedOrders = clientOrdersList.map(order => ({
        title: order.title,
        quantity: order.quantity,
        price: order.price,
        total: order.total
    }));

    // Datos de las reservas
    const formattedReservations = clientReservationsList.map(reservation => ({
        title: reservation.title,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        price: reservation.price,
        total: reservation.total
    }));

    // Calcular subtotal de órdenes y reservas
    const subtotalOrders = formattedOrders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2);
    const subtotalReservations = formattedReservations.reduce((acc, reservation) => acc + parseFloat(reservation.total), 0).toFixed(2);

    // Añadir encabezado de la empresa
    addCompanyHeader();

    // Añadir información del cliente y de la factura
    addClientAndInvoiceInfo(invoice);

    // Añadir tabla de órdenes si hay datos
    if (formattedOrders.length > 0) {
        autoTable(doc, {
            startY: 90,
            head: [['Producto', 'Cantidad', 'Precio unitario', 'Total']],
            body: formattedOrders.map(order => [
                order.title,
                order.quantity,
                order.price,
                order.total
            ]),
            theme: 'plain'
        });

        // Resumen de órdenes
        autoTable(doc, {
            startY: doc.previousAutoTable.finalY + 10,
            head: [['', '', '', '']],
            body: [
                ['Total:', subtotalOrders, '', ''],
                ['IVA:', '20%', '', ''],
                ['Subtotal:', subtotalOrders, '', '']
            ],
            theme: 'plain'
        });

        if (formattedReservations.length > 0) {
            doc.addPage();
        }
    }

    // Añadir tabla de reservas si hay datos
    if (formattedReservations.length > 0) {
        // Añadir encabezado de la empresa en la nueva página
        addCompanyHeader();

        // Añadir información del cliente y de la factura en la nueva página
        addClientAndInvoiceInfo(invoice);

        autoTable(doc, {
            startY: 90,
            head: [['Habitación', 'Fecha de inicio', 'Fecha de fin', 'Precio por noche', 'Total']],
            body: formattedReservations.map(reservation => [
                reservation.title,
                reservation.startDate,
                reservation.endDate,
                reservation.price,
                reservation.total
            ]),
            theme: 'plain'
        });

        // Resumen de reservas
        autoTable(doc, {
            startY: doc.previousAutoTable.finalY + 10,
            head: [['', '', '', '', '']],
            body: [
                ['Total:', subtotalReservations, '', '', ''],
                ['IVA:', '20%', '', '', ''],
                ['Subtotal:', subtotalReservations, '', '', '']
            ],
            theme: 'plain'
        });
    }

    // Guardar el PDF
    doc.save(`Factura_${invoice.id}.pdf`);
};

export default generateInvoiceHistorial;
