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
            this.belongsTo(models.Category, {
                foreignKey: "categoryId",
                as: "category",
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
            name: DataTypes.STRING,
            cost: DataTypes.DOUBLE,
            stock: DataTypes.INTEGER,
            categoryId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Ingredient",
        }
    );
    return Ingredient;
};
