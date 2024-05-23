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
            // define association here if needed
            this.belongsToMany(models.Ingredient, { foreignKey: "ingredientId" });
            this.belongsToMany(models.Product, { foreignKey: "productId" });
        }
    }
    ProductIngredient.init(
        {
            productId: DataTypes.INTEGER,
            ingredientId: DataTypes.INTEGER,
            quantity: DataTypes.FLOAT
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
