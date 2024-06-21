import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateOrder = (order) => {
  const { id, table, client, waiter, date, products, note } = order;

  const pageHeight = 70 + products.length * 4 + (note ? 10 : 0); // Ajuste de altura si hay nota
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, pageHeight] // 80mm de ancho, altura ajustable
  });

  // Encabezado
  doc.setFontSize(10);
  doc.text("PEDIDO  #" + id, 40, 5, { align: "center" }); // Ajustar Y a 5mm
  
  // Información de la orden
  doc.setFontSize(8);
  let currentY = 10; // Ajustar Y inicial a 10mm
  doc.text(`Cuenta: ${client} - Orden 1`, 5, currentY);
  currentY += 4; // Reducir espacio
  doc.text(`Mesa: ${table} - PRINCIPAL`, 5, currentY);
  currentY += 4; // Reducir espacio
  doc.text(`Mesero: ${waiter}`, 5, currentY);
  currentY += 4; // Reducir espacio
  doc.text(`Fecha y hora del pedido: ${date}`, 5, currentY);
  currentY += 4; // Reducir espacio

  // Línea de separación
  doc.setLineWidth(0.5);
  doc.line(5, currentY, 75, currentY);
  currentY += 2; // Reducir espacio

  // Productos
  const productRows = products.map((product) => {
    const row = [`-> ${product.quantity.toFixed(1)}`, product.name];
    if (product.productNote) {
      row.push(product.productNote);
    }
    return row;
  });

  const hasNotes = productRows.some(row => row.length > 2);
  const head = hasNotes
    ? [['  CANTIDAD', 'PRODUCTO', 'NOTA']] // Añadir dos espacios al principio de 'CANTIDAD'
    : [['  CANTIDAD', 'PRODUCTO']]; // Añadir dos espacios al principio de 'CANTIDAD'

  const columnWidths = hasNotes
    ? {
        0: { cellWidth: 20 }, // Ajustar anchura de la columna 'CANTIDAD'
        1: { cellWidth: 30 }, // Ajustar anchura de la columna 'PRODUCTO'
        2: { cellWidth: 25 }  // Ajustar anchura de la columna 'NOTA'
      }
    : {
        0: { cellWidth: 20 }, // Ajustar anchura de la columna 'CANTIDAD'
        1: { cellWidth: 55 }  // Ajustar anchura de la columna 'PRODUCTO'
      };

  autoTable(doc, {
    head: head,
    body: productRows,
    startY: currentY, // Usar currentY
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
      halign: 'center', // Centrar el encabezado
      valign: 'middle' // Centrar verticalmente
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      halign: 'center', // Centrar el contenido de las celdas
      lineHeight: 1
    },
    columnStyles: columnWidths,
    margin: { left: hasNotes ? 0 : 5 } // Mover la tabla hacia la izquierda si hay notas
  });

  // Nota del pedido
  if (note) {
    const noteStartY = currentY + products.length * 8 + 6; // Ajustar según la posición de la tabla
    doc.text(`Nota: ${note}`, 5, noteStartY); // Ajustar X a 5mm
  }

  // Guardar el PDF
  doc.save(`Orden_${id}.pdf`);
};

export default generateOrder;
