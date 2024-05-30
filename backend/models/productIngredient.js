"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductIngredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Ingredient, { through: models.ProductIngredient, foreignKey: "ingredientId" });
            this.belongsTo(models.Product, { through: models.ProductIngredient, foreignKey: "productId" });
        }
    }
    ProductIngredient.init(
        {
            productId: DataTypes.INTEGER,
            ingredientId: DataTypes.INTEGER,
            quantity: DataTypes.DECIMAL(10,2)
        },
        {
            sequelize,
            modelName: "ProductIngredient",
            tableName: "productingredient",
            timestamps: false,
        }
    );
    return ProductIngredient;
};
