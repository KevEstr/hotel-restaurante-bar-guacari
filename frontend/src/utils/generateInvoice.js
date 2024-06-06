// generateInvoice.js
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";

const generateInvoice = (reservation, clientOrdersList, clientReservationsList) => {
    // Preparar los datos de la factura
    const formattedOrders = clientOrdersList.flatMap(order =>
        order.products.map(product => ({
            title: product.name,
            description: "", // Puedes dejar esto en blanco o agregar información adicional si es necesario
            price: product.price.toFixed(2),
            quantity: product.OrderProduct.quantity,
            unit: "piece", // Puedes cambiar esto según la unidad del producto
            total: (product.price * product.OrderProduct.quantity).toFixed(2)
        }))
    );

    const formattedReservations = clientReservationsList.flatMap(reservation =>
        reservation.rooms.map(room => ({
            title: room.name,
            description: "", // Puedes dejar esto en blanco o agregar información adicional si es necesario
            price: reservation.price.toFixed(2),
            startDate: reservation.start_date,
            endDate: reservation.end_date,
            total: reservation.total.toFixed(2)
        }))
    );

    const subtotal = formattedOrders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2);

    // Generar la descripción de las reservas
    const reservationDescription = formattedReservations.map((res, index) => 
        `Reserva ${index + 1}:
        - ID: ${reservation.id}
        - Habitación: ${res.title}
        - Precio por noche: ${res.price}
        - Fecha de inicio: ${res.startDate}
        - Fecha de fin: ${res.endDate}
        - Total: ${res.total}`
    ).join('\n\n');

    // Configurar los parámetros para la factura
    const props = {
        outputType: OutputType.Save,
        fileName: `Factura_${reservation.id}`,
        orientationLandscape: false, // Orientación de la página (horizontal o vertical)
        compress: true, // Comprimir el archivo PDF

        logo: {
            src: "/factura.png",
            type: "PNG",
            width: 53.33, // Ancho del logo (en milímetros)
            height: 26.66, // Alto del logo (en milímetros)
            margin: {
                top: 0, // Margen superior (en milímetros)
                left: 0 // Margen izquierdo (en milímetros)
            }
        },
        // Configuración de la información de la empresa
        business: {
            name: "Hotel Guacarí", // Nombre de la empresa
            address: "Cl. 19 #23 71, San Marcos, Sucre", // Dirección de la empresa
            phone: "3118901728", // Teléfono de la empresa
            email: "nuevasmujeresbonitas@gmail.com", // Correo electrónico de la empresa
            website: "www.nuevasmujeresbonitas.com" // Sitio web de la empresa
        },
        // Configuración de la información del cliente
        contact: {
            label: "Factura emitida para:",
            name: reservation.client.name,
            address: reservation.client.address,
            phone: reservation.client.phone,
            email: reservation.client.email,
        },
        invoice: {
            label: "Factura #: ",
            num: reservation.id, // Usamos el ID de la reserva como número de factura
            invDate: `Fecha de pago: ${new Date().toLocaleString()}`, // Fecha de pago
            invGenDate: `Fecha de factura: ${new Date().toLocaleString()}`, // Fecha de generación de factura
            invDescLabel: "Detalle de Reservas",
            invDesc: reservationDescription, // Añadir la descripción de las reservas aquí
            // Configuración de la tabla de productos
            header: [
                { title: "#", style: { width: 10 } },
                { title: "Producto", style: { width: 40 } },
                { title: "Cantidad", style: { width: 20 } },
                { title: "Precio unitario" },
                { title: "Total" }
            ],
            table: formattedOrders.map((order, index) => [
                index + 1, // Número de ítem
                order.title, // Nombre del producto
                order.quantity, // Cantidad
                order.price, // Precio unitario
                order.total // Precio total
            ]),

            // Filas adicionales
            additionalRows: [
                {
                    col1: 'Total:',
                    col2: subtotal,
                    col3: 'ALL',
                    style: {
                        fontSize: 14
                    }
                },
                {
                    col1: 'VAT:',
                    col2: '20',
                    col3: '%',
                    style: {
                        fontSize: 10
                    }
                },
                {
                    col1: 'Subtotal:',
                    col2: subtotal, // Aquí puedes colocar la lógica para el total si es diferente al subtotal
                    col3: 'ALL',
                    style: {
                        fontSize: 10
                    }
                },
            ],
        },
    };

    jsPDFInvoiceTemplate(props);
};

export default generateInvoice;
