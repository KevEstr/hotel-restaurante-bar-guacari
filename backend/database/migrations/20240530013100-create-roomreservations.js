'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roomreservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reservationId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        references: {
          model: 'reservations',
          key: 'id'
        }
      },
      roomId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        references: {
          model: 'rooms',
          key: 'id'
        }
      }
    });
    await queryInterface.addConstraint('roomreservations', {
      fields: ['reservationId'],
      type: 'foreign key',
      name: 'roomreservations_reservationId_fk',
      references: {
        table: 'reservations',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
    await queryInterface.addConstraint('roomreservations', {
      fields: ['roomId'],
      type: 'foreign key',
      name: 'roomreservations_roomId_fk',
      references: {
        table: 'rooms',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roomreservations');
  }
};
