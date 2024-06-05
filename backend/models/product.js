"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Category, {
                foreignKey: "categoryId",
                as: "category",
            });
            this.belongsToMany(models.Order, {
                through: models.OrderProduct,
                foreignKey: "productId",
                as: "order",
            });
            // Define the many-to-many relationship with Ingredient
            this.belongsToMany(models.Ingredient, {
                through: "ProductIngredient",
                foreignKey: "productId",
                as: "ingredients",
            });
        }
    }
    Product.init(
        {
            name: DataTypes.STRING,
            price: DataTypes.DOUBLE,
            categoryId: DataTypes.INTEGER,
            isComposite: DataTypes.BOOLEAN,
            stock: DataTypes.INTEGER,
            averagePrice: DataTypes.DECIMAL(10,2),
        },
        {
            sequelize,
            modelName: "Product",
        }
    );
    return Product;
};
