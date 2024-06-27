"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Client, {
                foreignKey: "clientId",
                as: "client",
            });

            this.belongsTo(models.Reservation, {
                foreignKey: "reservation_id",
                as: "reservation",
            });
            
            this.belongsTo(models.Table, {
                foreignKey: "tableId",
                as: "table",
            });

            this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            this.belongsToMany(models.Product, {
                through: models.OrderProduct,
                foreignKey: "orderId",
                as: "products",
            });

            this.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });

        }
        
    }
    Order.init(
        {
            total: DataTypes.DOUBLE,
            isPaid: DataTypes.BOOLEAN,
            delivery: DataTypes.BOOLEAN,
            note: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            clientId: DataTypes.INTEGER,
            tableId: DataTypes.INTEGER,
            paymentId: DataTypes.INTEGER,
            type: DataTypes.BOOLEAN,
            reservation_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Order",
        }
    );

    Order.addHook('beforeDestroy', async (order, options) => {
        await sequelize.models.OrderAudit.create({
            orderId: order.id,
            concept: options.concept,
            deletedBy: options.userId, 
        });
    });
      
    return Order;
};
