const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { Order } = require('../models');
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    updateOrderPay,
    updateOrderDelivery,
    deleteOrder,
    getStatistics,
    getClientOrders,
} = require("../controllers/order");

// VALIDATORS
const { runValidation } = require("../validators");
const { orderCreateValidator } = require("../validators/order");

//ROUTES
router
    .route("/")
    .post(protect, orderCreateValidator, runValidation, createOrder)
    .get(protect, getOrders);

router.route("/statistics").get(getStatistics);

router
    .route("/:id")
    .get(protect, getOrder)
    .put(protect, updateOrder)
    .delete(protect, deleteOrder);

router.post("/:id/pay", protect, updateOrderPay);
router.post("/:id/delivery", protect, updateOrderDelivery);

router.route('/client/:id').get(protect, getClientOrders);

router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    console.log('Solicitud DELETE recibida en el backend');

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Órden no encontrada' });
        }

        // Eliminar la órden
        console.log('Órden encontrada, procediendo a eliminarla');
        await order.destroy({ concept: reason, userId: req.user.id });

        res.json({ message: 'Órden eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la órden' });
    }
});



module.exports = router;
