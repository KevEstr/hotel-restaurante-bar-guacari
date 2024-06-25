"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("invoices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reservationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'reservations', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      clientDetails: {
        type: Sequelize.JSON,
      },
      orders: {
        type: Sequelize.JSON,
      },
      agreementName: {
        type: Sequelize.STRING(20),
      },
      paymentMethodName: {
        type: Sequelize.STRING(20),
      },
      reservations: {
        type: Sequelize.JSON,
      },
      subtotalOrders: {
        type: Sequelize.FLOAT,
      },
      subtotalReservations: {
        type: Sequelize.FLOAT,
      },
      total: {
        type: Sequelize.FLOAT,
      },
      invoiceDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("invoices");
  }
};
