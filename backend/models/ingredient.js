"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Define the many-to-many relationship with Product
            this.belongsToMany(models.Product, {
                through: "ProductIngredient",
                foreignKey: "ingredientId",
                as: "products",
            });

            this.belongsToMany(models.Order, {
                through: "OrderIngredient",
                foreignKey: "ingredientId",
                as: "order",
            });
        }
    }
    Ingredient.init(
        {
            name: DataTypes.TEXT,
            stock: DataTypes.DECIMAL(10, 2),
            averagePrice: DataTypes.DECIMAL(10, 2),
            minQty: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: "Ingredient",
        }
    );
    return Ingredient;
};
