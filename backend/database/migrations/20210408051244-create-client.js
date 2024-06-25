'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      lastnames: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(13),
        allowNull: false,
        defaultValue: '999999999'
      },
      dni: {
        type: Sequelize.STRING(13),
        unique: true,
        allowNull: false
      },
      agreementId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      has_reservation: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      has_order: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('Clients', {
      fields: ['agreementId'],
      type: 'foreign key',
      name: 'fk_clients_agreement',
      references: {
        table: 'agreements',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Clients');
  }
};
