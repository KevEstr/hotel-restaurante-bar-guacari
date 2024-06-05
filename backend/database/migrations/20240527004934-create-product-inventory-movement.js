'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productinventorymovements', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
      ingredientId: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
          type: Sequelize.DECIMAL(10,2),
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
      totalPrice: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
      }
  });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('productinventorymovements');
  }
};
