import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generateInvoice = (order) => {
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
    const addClientAndInvoiceInfo = (yOffset = 50) => {
        doc.setFontSize(10);
        doc.setFont("helvetica");
        doc.text('Factura emitida para:', 10, yOffset);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(order.client.name, 10, yOffset + 5);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(order.client.address, 10, yOffset + 10);
        doc.text(order.client.phone, 10, yOffset + 15);
        doc.text(order.client.email, 10, yOffset + 20);
        doc.setFont("helvetica");
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
        doc.text('Factura #:', 200, yOffset, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128); // Cambiar color a gris
        doc.text(order.id.toString(), 240, yOffset, { align: 'right' });
        doc.text(`Fecha de pago: ${new Date().toLocaleString()}`, 200, yOffset + 5, { align: 'right' });
        doc.text(`Fecha de factura: ${new Date().toLocaleString()}`, 200, yOffset + 10, { align: 'right' });
        doc.line(10, yOffset + 25, 200, yOffset + 25); // Línea separadora
        doc.setTextColor(0, 0, 0); // Restaurar color a negro
    };

    // Datos de las órdenes
    const formattedOrders = order.products.map((product, index) => ({
        index: index + 1,
        title: product.name,
        quantity: product.OrderProduct.quantity,
        price: product.price.toFixed(2),
        total: (product.price * product.OrderProduct.quantity).toFixed(2)
    }));

    // Calcular subtotal de órdenes y reservas
    const subtotalOrders = formattedOrders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2);

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
                ['Total:', subtotalOrders, '', '', ''],
                ['IVA:', '20%', '', '', ''],
                ['Subtotal:', subtotalOrders, '', '', '']
            ],
            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [255, 255, 255], lineWidth: 0 }, // Quitar todas las líneas
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0]},
            columnStyles: {
                0: { halign: 'right' },
                1: { halign: 'right' }
            },
            tableWidth: 'wrap',
            theme: 'plain'
        });
    }

    // Guardar el PDF
    doc.save(`Factura_${order.id}.pdf`);
};

export default generateInvoice;
