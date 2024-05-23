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
        }
    }
    Ingredient.init(
        {
            name: DataTypes.STRING,
            ingredientType: DataTypes.INTEGER,
            stock: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Ingredient",
        }
    );
    return Ingredient;
};
