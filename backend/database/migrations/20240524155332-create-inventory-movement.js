'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('inventorymovements', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ingredientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Ingredients',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            quantity: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('entrada', 'salida'),
                allowNull: false
            },
            concept: {
                type: Sequelize.STRING,
                allowNull: true // Opcional
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('inventorymovements');
    }
};
