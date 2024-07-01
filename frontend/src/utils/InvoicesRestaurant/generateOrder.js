import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import printJS from "print-js";
import axios from 'axios';

const generateOrder = async (order, createOrder = false) => {

    const { id, table, client, waiter, date, products, note } = order;

    // Verificar y convertir products si es una cadena JSON
    let parsedProducts = Array.isArray(products) ? products : JSON.parse(products);

    const pageHeight = 70 + parsedProducts.length * 4 + (note ? 10 : 0); // Ajuste de altura si hay nota
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, pageHeight] // 80mm de ancho, altura ajustable
    });

    // Encabezado
    doc.setFontSize(10);
    doc.text("PEDIDO #" + id, 40, 5, { align: "center" });

    // Información de la orden
    doc.setFontSize(8);
    let currentY = 10;
    doc.text(`Cuenta: ${client}`, 5, currentY);
    currentY += 4;
    doc.text(`Mesa: ${table}`, 5, currentY);
    currentY += 4;
    doc.text(`Mesero: ${waiter}`, 5, currentY);
    currentY += 4;
    doc.text(`Fecha y hora del pedido: ${date}`, 5, currentY);
    currentY += 4;

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(5, currentY, 75, currentY);
    currentY += 2;

    // Productos
    const productRows = parsedProducts.map((product) => {
        const row = [`-> ${product.quantity.toFixed(1)}`, product.name];
        if (product.productNote) {
            row.push(product.productNote);
        }
        return row;
    });

    const hasNotes = productRows.some(row => row.length > 2);
    const head = hasNotes
        ? [['  CANTIDAD', 'PRODUCTO', 'NOTA']]
        : [['  CANTIDAD', 'PRODUCTO']];

    const columnWidths = hasNotes
        ? {
            0: { cellWidth: 20 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 }
        }
        : {
            0: { cellWidth: 20 },
            1: { cellWidth: 55 }
        };

    autoTable(doc, {
        head: head,
        body: productRows,
        startY: currentY,
        theme: 'plain',
        styles: { 
            fontSize: 8,
            cellPadding: 1,
            valign: 'middle'
        },
        headStyles: {
            fontStyle: 'normal',
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            halign: 'center',
            valign: 'middle'
        },
        bodyStyles: {
            textColor: [0, 0, 0],
            halign: 'center',
            lineHeight: 1
        },
        columnStyles: columnWidths,
        margin: { left: hasNotes ? 0 : 5 } 
    });

    // Nota del pedido
    if (note) {
        const noteStartY = currentY + parsedProducts.length * 8 + 6;
        doc.text(`Nota: ${note}`, 5, noteStartY);
    }

    if (!createOrder){
      doc.save(`Orden #${order.id}.pdf`);
    }

    if (createOrder) {
        try {
            await axios.post('/api/orderinvoices', {
                table,
                client,
                waiter,
                date,
                products: parsedProducts,
                note,
                orderId: id,
            });
            console.log('Orden creada exitosamente');
        } catch (error) {
            console.error('Error al crear la orden:', error);
        }
        const pdfBlob = doc.output('blob');


      // Usar printJS para imprimir el PDF
      printJS({
          printable: URL.createObjectURL(pdfBlob),
          type: 'pdf',
          onPrintDialogClose: () => URL.revokeObjectURL(pdfBlob)
      });

    }

};

export default generateOrder;
