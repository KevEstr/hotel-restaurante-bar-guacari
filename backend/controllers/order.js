const asyncHandler = require("express-async-handler");
const Order = require("../models").Order;
const { Op } = require("sequelize");
const Client = require("../models").Client;
const Table = require("../models").Table;
const Product = require("../models").Product;
const Ingredient = require("../models").Ingredient;
const OrderProduct = require("../models").OrderProduct;
const OrderAudit = require("../models").OrderAudit;


//utils
const {
    stock,
    updateTable,
    addProductsInOrder,
    updateProductsStock,
} = require("../utils/order");

const {
    verifyStock,
    updateStockAndCreateMovement
} = require("../utils/ingredient");


//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/user
exports.getOrders = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const delivery = Boolean(req.query.delivery) || false;
    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {
        include: [
            { model: Client, as: "client" },
            { model: Table, as: "table" },
            {
                model: Product,
                as: "products",
                through: { model: OrderProduct, as: "orderProducts" }
            },
        ],
        attributes: {
            exclude: ["userId", "clientId", "tableId", "updatedAt"],
        },
        order: [["id", "DESC"]],
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { total: keyword },
                    { "$client.name$": { [Op.like]: `%${keyword}%` } },
                    { "$table.name$": { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }

    if (delivery) {
        options = {
            ...options,
            where: {
                ...options.where,
                delivery: {
                    [Op.eq]: true,
                },
            },
        };
    }

    const count = await Order.count({ ...options });
    const orders = await Order.findAll({ ...options });

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get order by ID
//@route    GET /api/order/:id
//@access   Private/user
exports.getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Update order to paid
//@route    POST /api/orders/:id/pay
//@access   Private/user
exports.updateOrderPay = asyncHandler(async (req, res) => {
    const { paymentId } = req.body; // Recibir paymentId desde la solicitud

    const order = await Order.findByPk(req.params.id);

    if (order) {
        if (order.tableId) {
            const table = await Table.findByPk(order.tableId);
            table.occupied = false;
            await table.save();
        }

        const client = await Client.findByPk(order.clientId);
        if (client) {
            client.has_order = 0;
            await client.save();
        }

        order.isPaid = !order.isPaid;
        order.paymentId = paymentId; // Asignar paymentId a la orden

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});


const findDifferences = (oldProducts, newProducts) => {
    const restockProducts = [];
    const newProductsToAdd = [];
    const modifiedProducts = [];

    const oldProductsMap = new Map(oldProducts.map(p => [p.id, p]));

    newProducts.forEach(newProduct => {
        const oldProduct = oldProductsMap.get(newProduct.id);
        if (oldProduct) {
            if (newProduct.quantity !== oldProduct.quantity) {
                modifiedProducts.push({
                    id: newProduct.id,
                    oldQuantity: oldProduct.quantity,
                    newQuantity: newProduct.quantity
                });
            }
            oldProductsMap.delete(newProduct.id);
        } else {
            newProductsToAdd.push(newProduct);
        }
    });

    restockProducts.push(...oldProductsMap.values());

    return { restockProducts, newProductsToAdd, modifiedProducts };
};
//@desc     Create a Order
//@route    POST /api/orders
//@access   Private/user
exports.createOrder = asyncHandler(async (req, res) => {
    //get data from request
    const { total, tableId, clientId, products, delivery, note, userId, paymentId } = req.body;

    try {
        // Verificar si hay suficiente inventario
        const createdOrder = await Order.create({
            total,
            tableId: !delivery ? tableId : null,
            userId: userId,
            clientId: clientId,
            delivery: delivery,
            note: note,
            paymentId: paymentId,
        });

        // Crear productos en la orden
        await addProductsInOrder(createdOrder, products);

        // Actualizar la mesa a ocupada si no es una entrega
        if (!delivery) {
            await updateTable(createdOrder.tableId, true);
        }

        await Client.update(
            { has_order: 1 },
            { where: { id: clientId } }
        );
        

        // Actualizar el stock y crear movimientos de inventario
        await updateStockAndCreateMovement(products, userId, createdOrder.id,-1,false,true);

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const diffProducts = (oldProducts, newProducts) => {
    const addedProducts = [];
    const removedProducts = [];
    const modifiedProducts = [];

    const oldProductMap = new Map();
    oldProducts.forEach(product => oldProductMap.set(product.id, product));

    newProducts.forEach(newProduct => {
        const oldProduct = oldProductMap.get(newProduct.id);
        if (oldProduct) {
            if (newProduct.quantity !== oldProduct.OrderProduct.quantity) {
                modifiedProducts.push({ oldProduct, newProduct });
            }
            oldProductMap.delete(newProduct.id);
        } else {
            addedProducts.push(newProduct);
        }
    });

    oldProductMap.forEach(oldProduct => removedProducts.push(oldProduct));
    //throw new Error(`oldProductMap: ${JSON.stringify(oldProductMap, null, 2)}`);
    //throw new Error(`oldProductMap: ${oldProductMap}`);


    return { addedProducts, removedProducts, modifiedProducts };
};


const adjustInventoryForChanges = async (productChanges, userId, orderId) => {
    const { addedProducts, removedProducts, modifiedProducts } = productChanges;

    if(removedProducts!==null){
        await updateStockAndCreateMovement(removedProducts, userId, orderId, 1, false, false);
    }
    //throw new Error(`addedProducts ${JSON.stringify(addedProducts, null, 2)}`);
    if(addedProducts!==null){
        await updateStockAndCreateMovement(addedProducts, userId, orderId, -1, false, false);
    }
    //throw new Error(`modifiedProducts.lenght ${JSON.stringify(modifiedProducts!==null, null, 2)}`);
    if(modifiedProducts!==null){
    await updateStockAndCreateMovement(modifiedProducts, userId, orderId, 0, true, false);
    }
};


//@desc     Update order
//@route    PUT /api/orders/:id
//@access   Private/user
exports.updateOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { total, tableId, clientId, products, delivery, note, userId, paymentId } = req.body;

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Verificar si hay suficiente inventario para los nuevos productos
        /*const stockAvailable = await verifyStock(products);
        if (!stockAvailable) {
            return res.status(400).json({ message: "There is no stock available for the updated products" });
        }*/

        // Actualizar la orden
        order.total = total;
        order.clientId = clientId;
        order.delivery = delivery;
        order.note = note;
        order.tableId = !delivery ? tableId : null;
        order.userId= userId;
        order.paymentId = paymentId;

        const oldProducts = await order.getProducts({
            include: [
                {
                    model: Ingredient,
                    as: 'ingredients',
                    through: {
                        attributes: ['ingredientId', 'productId', 'quantity']
                    }
                },
            ]
        });
        


        const productChanges = diffProducts(oldProducts, products);

        await adjustInventoryForChanges(productChanges, userId, orderId);


        //await updateStockAndCreateMovement(oldProducts, userId, orderId, +1);

        // Eliminar los productos actuales de la orden
        await order.setProducts(null);

        // Agregar los nuevos productos a la orden
        await addProductsInOrder(order, products);

        // Actualizar el stock y crear movimientos de inventario para los nuevos productos
        //await updateStockAndCreateMovement(products, userId, orderId, -1);

        // Si la orden es para una mesa, actualizar el estado de la mesa
        if (!delivery) {
            await updateTable(tableId, true);
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
        res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
        throw new Error("Órden no encontrada");
    }
});


//@desc     Update order to delivered
//@route    POST /api/orders/:id/delivery
//@access   Private/user
exports.updateOrderDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        order.delivery = !order.delivery;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

//@desc     Delete a order
//@route    DELETE /api/orders/:id
//@access   Private/user
exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
  
    if (order) {
      // Guardar los datos de la reservación en la tabla de auditoría
      await OrderAudit.create({
        orderId: order.id,
        concept: req.body.reason,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      });
  
      const table = await Table.findByPk(order.tableId);

      if (table) {
        table.occupied = false;
        await table.save();
      }

      const client = await Client.findByPk(order.clientId);
        if (client) {
            client.has_order = 0;
            await client.save();
        }

      await order.destroy();

      res.json({ message: 'Order removed' });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });


//@desc     Get statistics
//@route    POST /api/orders/statistics
//@access   Private/user
exports.getStatistics = asyncHandler(async (req, res) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const sales = await Order.findAll({
        where: {
            isPaid: true,
        },
        limit: 5,
        include: { all: true, nested: true },
    });

    const totalSales = await Order.sum("total", {
        where: {
            isPaid: true,
        },
    });

    const deliveriesMade = await Order.count({
        where: {
            delivery: true,
            isPaid: true,
        },
    });

    const totalOrdersPaid = await Order.count({
        where: {
            isPaid: true,
        },
    });

    const todaySales = await Order.sum("total", {
        where: {
            updatedAt: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW,
            },
            isPaid: true,
        },
    });

    const orders = await Order.findAll({
        where: {
            [Op.or]: [{ isPaid: false }],
        },
        include: { all: true, nested: true },
        attributes: {
            exclude: ["userId", "clientId", "tableId"],
        },
    });

    res.json({
        statistics: {
            total: totalSales,
            today: todaySales,
            orders: totalOrdersPaid,
            deliveries: deliveriesMade,
        },
        sales,
        orders,
    });
});

exports.getClientOrders = asyncHandler(async (req, res) => {
    const clientId = req.params.id;
    const orders = await Order.findAll({ where: { clientId } });
    if (orders) {
        res.json(orders);
    } else {
        res.status(404);
        throw new Error('Orders not found');
    }
});
