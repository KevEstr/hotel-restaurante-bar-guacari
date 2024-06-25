const { Invoice, Reservation, Order, Client } = require('../models');

const createInvoice = async (req, res) => {
  const { reservation, clientOrdersList, clientReservationsList, agreementName, paymentMethodName } = req.body;

  const formattedOrders = clientOrdersList.flatMap(order =>
    order.products.map(product => ({
      title: product.name,
      quantity: product.OrderProduct.quantity,
      price: product.price,
      total: product.price * product.OrderProduct.quantity
    }))
  );

  const formattedReservations = clientReservationsList.flatMap(reservation =>
    reservation.rooms.map(room => ({
      title: room.name,
      startDate: reservation.start_date,
      endDate: reservation.end_date,
      price: reservation.price,
      total: reservation.total
    }))
  );

  const subtotalOrders = formattedOrders.reduce((acc, order) => acc + order.total, 0);
  const subtotalReservations = formattedReservations.reduce((acc, reservation) => acc + reservation.total, 0);
  const total = subtotalOrders + subtotalReservations;

  try {
    const invoice = await Invoice.create({
      reservationId: reservation.id,
      clientDetails: reservation.client,
      orders: formattedOrders,
      reservations: formattedReservations,
      subtotalOrders,
      subtotalReservations,
      total,
      agreementName,
      paymentMethodName,
      invoiceDate: new Date()
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la factura' });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ where: { reservationId: id } });

    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
};

module.exports = { createInvoice, getInvoiceById };
