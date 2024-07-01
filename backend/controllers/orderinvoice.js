const { OrderInvoice } = require('../models');

const createOrder = async (req, res) => {
  const { id, table, client, waiter, date, products, note, orderId } = req.body;

  console.log("Datos Recibidos:", table, client, waiter, date, products, note);

  try {
    const order = await OrderInvoice.create({
      table,
      client,
      waiter,
      date,
      products,
      note,
      orderId
    });

    console.log("Datos Orden:", order);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await OrderInvoice.findOne({ where: { orderId: id } });

    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
};

module.exports = { createOrder, getInvoiceById };
