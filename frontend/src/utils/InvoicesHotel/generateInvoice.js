import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const generateInvoice = async (reservation, clientOrdersList, agreementName, paymentMethodName) => {
    const doc = new jsPDF();

    console.log('Datos de entrada:', {
        reservation,
        clientOrdersList,
        agreementName,
        paymentMethodName
    });

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
    const addClientAndInvoiceInfo = (yOffset = 50) => {
        doc.setFontSize(10);
        doc.setFont("helvetica");
        doc.text('Factura emitida para:', 10, yOffset);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`${reservation.client.name} ${reservation.client.lastnames}`, 10, yOffset + 5);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(agreementName, 10, yOffset + 10);
        doc.text(reservation.client.phone, 10, yOffset + 15);
        doc.setFont("helvetica");
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
        doc.text('Factura #:', 200, yOffset, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.text(reservation.id.toString(), 240, yOffset, { align: 'right' });
        doc.text(`Fecha de pago: ${new Date().toLocaleString()}`, 200, yOffset + 5, { align: 'right' });
        doc.text(`Fecha de factura: ${new Date().toLocaleString()}`, 200, yOffset + 10, { align: 'right' });
        doc.text(`Método de pago: ${paymentMethodName}`, 200, yOffset + 15, {align: 'right'});
        doc.line(10, yOffset + 25, 200, yOffset + 25); // Línea separadora
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
    };

    // Datos de las órdenes
    const formattedOrders = clientOrdersList.flatMap(order =>
        order.products.map((product, index) => ({
            index: index + 1,
            title: product.name,
            quantity: product.OrderProduct.quantity,
            price: product.price.toFixed(2),
            total: (product.price * product.OrderProduct.quantity).toFixed(2)
        }))
    );

    console.log('formattedOrders:', formattedOrders);

    // Datos de las reservas
    const formattedReservations = reservation.room.map((room, index) => ({
        index: index + 1,
        title: room.name,
        startDate: reservation.start_date,
        endDate: reservation.end_date,
        price: reservation.price.toFixed(2),
        total: reservation.total.toFixed(2)
    }));

    console.log('formattedReservations:', formattedReservations);

    // Calcular subtotal de órdenes y reservas
    const subtotalOrders = formattedOrders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2);
    const subtotalReservations = formattedReservations.reduce((acc, reservation) => acc + parseFloat(reservation.total), 0).toFixed(2);

    console.log('subtotalOrders:', subtotalOrders);
    console.log('subtotalReservations:', subtotalReservations);

    // Añadir encabezado de la empresa
    addCompanyHeader();

    // Añadir información del cliente y de la factura
    addClientAndInvoiceInfo();

    // Añadir tabla de órdenes si hay datos
    if (formattedOrders.length > 0) {
        autoTable(doc, {
            startY: 90,
            head: [['#', 'Producto', 'Cantidad', 'Precio unitario', 'Total']],
            body: formattedOrders.map(order => [
                order.index,
                order.title,
                order.quantity,
                order.price,
                order.total
            ]),
            styles: { overflow: 'linebreak', fontSize: 10, lineColor: [255, 255, 255], lineWidth: 0 }, // Quitar todas las líneas
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
            theme: 'plain',
            tableLineColor: [255, 255, 255], // Quitar líneas horizontales
            tableLineWidth: 0,
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 20, halign: 'right' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 30, halign: 'right' }
            }
        });

        // Resumen de órdenes
        autoTable(doc, {
            startY: doc.previousAutoTable.finalY + 10,
            head: [['', '', '', '', '']],
            body: [
                ['', '', '', 'Total:', subtotalOrders],
                ['', '', '', 'IVA:', '20%'],
                ['', '', '', 'Subtotal:', subtotalOrders]
            ],
            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [255, 255, 255], lineWidth: 0 }, // Quitar todas las líneas
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 30 },
                2: { cellWidth: 30 },
                3: { halign: 'right', cellWidth: 30 },
                4: { halign: 'right', cellWidth: 30 }
            },
            tableWidth: 'wrap',
            theme: 'plain',
            margin: { right: 30 } // Ajuste de margen derecho
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
        addClientAndInvoiceInfo();

        autoTable(doc, {
            startY: 90,
            head: [['#', 'Habitación', 'Fecha de inicio', 'Fecha de fin', 'Precio por noche', 'Total']],
            body: formattedReservations.map(reservation => [
                reservation.index,
                reservation.title,
                reservation.startDate,
                reservation.endDate,
                reservation.price,
                reservation.total
            ]),
            styles: { overflow: 'linebreak', fontSize: 10, lineColor: [255, 255, 255], lineWidth: 0 }, // Quitar todas las líneas
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
            theme: 'plain',
            tableLineColor: [255, 255, 255], 
            tableLineWidth: 0,
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 30, halign: 'right' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 30, halign: 'right' },
                5: { cellWidth: 30, halign: 'right' }
            }
        });

        // Resumen de reservas
        autoTable(doc, {
            startY: doc.previousAutoTable.finalY + 10,
            head: [['', '', '', '', '', '']],
            body: [
                ['', '', '', '', 'Total:', subtotalReservations],
                ['', '', '', '', 'IVA:', '20%'],
                ['', '', '', '', 'Subtotal:', subtotalReservations]
            ],
            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [255, 255, 255], lineWidth: 0 }, // Quitar todas las líneas
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 30 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { halign: 'right', cellWidth: 30 },
                5: { halign: 'right', cellWidth: 30 }
            },
            tableWidth: 'wrap',
            theme: 'plain',
            margin: { right: 30 } // Ajuste de margen derecho
        });
    }

    // Guardar el documento
    doc.save(`Factura_${reservation.client.name}_${reservation.id}.pdf`);

    // Crear el FormData para enviar la factura
    const formData = new FormData();
    formData.append('invoice', doc.output('blob'), `Factura_${reservation.client.name}_${reservation.id}.pdf`);
    formData.append('client', JSON.stringify(reservation.client));
    formData.append('products', JSON.stringify(clientOrdersList));
    formData.append('payment', JSON.stringify(paymentMethodName));
    formData.append('date', new Date().toISOString());
    formData.append('orderId', reservation.id);

    try {
        const response = await axios.post('/paidorders', formData);
        console.log('Factura enviada correctamente:', response.data);
    } catch (error) {
        console.error('Error al enviar la factura:', error);
    }
};

export default generateInvoice;
