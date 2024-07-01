const { PaidOrder } = require('../models');

const createOrder = async (req, res) => {
  const { client, products, payment, date, orderId } = req.body;

  console.log("Datos Recibidos:", client, products, payment, date, orderId);

  try {
    const order = await PaidOrder.create({
      client,
      products,
      payment,
      date,
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
    const paidOrder = await PaidOrder.findOne({ where: { orderId: id } });

    if (paidOrder) {
      res.json(paidOrder);
    } else {
      res.status(404).json({ error: 'PaidOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la Orden Pagada' });
  }
};

module.exports = { createOrder, getInvoiceById };
