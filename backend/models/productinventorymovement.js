"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductInventoryMovement extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define association here
            this.belongsTo(models.Ingredient, { foreignKey: "ingredientId" });
            this.belongsTo(models.User, { foreignKey: "userId" });
            this.belongsTo(models.Product, { foreignKey: "productId" });

        }
    }
    ProductInventoryMovement.init(
        {
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            },
            ingredientId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Ingredients',
                    key: 'id'
                }
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('entrada', 'salida'),
                allowNull: false
            },
            concept: {
                type: DataTypes.TEXT,
                allowNull: true // Opcional
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: "ProductInventoryMovement",
            tableName: "productinventorymovements",
            timestamps: false,
        }
    );
    return ProductInventoryMovement;
};
