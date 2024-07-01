import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import printJS from "print-js";
import axios from 'axios';

const generateInvoice = async(order, payment, existingOrder) => {

  if (!payment && order.payment) {
    payment = order.payment;
  }

  if (typeof order === 'string') {
    order = JSON.parse(order);
  }

  if (typeof order.client === 'string') {
    order.client = JSON.parse(order.client);
  }

  if (typeof order.products === 'string') {
    order.products = JSON.parse(order.products);
  }

  const { id, client, products } = order;

  // Calcular la altura de la página
  const baseHeight = 90; // Aumentar la altura base
  const productHeight = products.length * 30; // Aumentar la altura por productos
  const pageHeight = baseHeight + productHeight; // Altura total de la página

  // Crear un nuevo documento PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, pageHeight] // 80mm de ancho, altura ajustable
  });

  // Encabezado de la empresa
  const addCompanyHeader = () => {
    const logo = new Image();
    logo.src = '/factura.png'; // Reemplaza con la ruta correcta a tu logo
    doc.addImage(logo, 'PNG', 5, 0, 20, 20); // Logo más grande
    doc.setFontSize(10);
    doc.setFont("helvetica");
    doc.text('Hotel Guacarí', 75, 5, { align: 'right' });
    doc.setFont("helvetica", "normal");
    doc.text('San Marcos, Sucre', 75, 10, { align: 'right' });
    doc.text('3118901728', 75, 15, { align: 'right' });
    doc.line(5, 20, 75, 20); // Línea separadora ajustada
  };

  // Información del cliente y de la factura
  const addClientAndInvoiceInfo = (yOffset = 25) => { // Ajustar yOffset
    doc.setFontSize(8);
    doc.setFont("helvetica");
    doc.text('Factura emitida para:', 5, yOffset);
    doc.setFont("helvetica", "normal");
    doc.text(`${client.name} ${client.lastnames}`, 5, yOffset + 5);
    doc.text(`CC: ${client.dni}`, 5, yOffset + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Método de Pago: ${payment}`, 75, yOffset + 5, { align: 'right' });
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 75, yOffset + 10, { align: 'right' });
    doc.line(5, 39, 75, 39); // Línea separadora ajustada
  };

  // Función para formatear números con puntos de miles y sin decimales
  const formatNumber = (num) => {
    return num.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Datos de los productos
  const productRows = products.map((product, index) => [
    index + 1,
    product.name,
    product.OrderProduct.quantity,
    formatNumber(product.price),
    formatNumber(product.price * product.OrderProduct.quantity)
  ]);

  // Añadir encabezado de la empresa
  addCompanyHeader();

  // Añadir información del cliente y de la factura
  addClientAndInvoiceInfo();

  // Añadir tabla de productos
  autoTable(doc, {
    head: [['#', 'Producto', 'Cant', 'Precio', 'Total']],
    body: productRows,
    startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 6 : 40, // Ajustar el inicio de la tabla
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle'
    },
    headStyles: {
      fontStyle: 'normal',
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      halign: 'center', // Centrar el encabezado
      valign: 'middle' // Centrar verticalmente
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      halign: 'center', // Centrar el contenido de las celdas
      lineHeight: 1
    },
    columnStyles: {
      0: { cellWidth: 6, halign: 'center'}, // Ajustar anchura de la columna '#'
      1: { cellWidth: 25 }, // Ajustar anchura de la columna 'Producto'
      2: { cellWidth: 11, halign: 'center' }, // Ajustar anchura de la columna 'Cant.'
      3: { cellWidth: 15, halign: 'center' }, // Ajustar anchura de la columna 'P.Unit.'
      4: { cellWidth: 17, halign: 'center' }  // Ajustar anchura de la columna 'Total'
    },
    margin: { left: 5, right: 5 },
    tableLineColor: [255, 255, 255], // Sin color de línea
    tableLineWidth: 0 // Sin línea
  });

  // Resumen de la factura
  const subtotal = productRows.reduce((acc, row) => acc + parseFloat(row[4].replace(/\./g, '')), 0);
  const formattedSubtotal = formatNumber(subtotal);
  const ivaPercentage = 0.18; // 18%
  const iva = subtotal * ivaPercentage;
  const total = subtotal + iva;
  const formattedTotal = formatNumber(total);

  const finalY = doc.previousAutoTable.finalY + 2;
  doc.line(5, finalY, 75, finalY); //
  doc.setFontSize(8);
  doc.text(`Subtotal: ${formattedSubtotal}`, 72, finalY + 5, { align: 'right' });
  doc.text(`IVA: 18%`, 72, finalY + 10, { align: 'right' });
  doc.text(`Total: ${formattedTotal}`, 72, finalY + 15, { align: 'right' });

  if (!existingOrder){
    doc.save(`Factura #${order.id}.pdf`);
  }
  

if (existingOrder){
  try {
    await axios.post('/api/paidorders', {
        client,
        products,
        payment,
        date: new Date().toISOString(),
        orderId: id,
    });
        console.log('Orden creada exitosamente');
    } catch (error) {
        console.error('Error al crear la orden:', error);
    }
    const pdfBlob = doc.output('blob');
  printJS({
    printable: URL.createObjectURL(pdfBlob),
    type: 'pdf',
    onPrintDialogClose: () => URL.revokeObjectURL(pdfBlob) // Liberar memoria
  });
  }

}

export default generateInvoice;
