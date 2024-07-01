'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reservations', 'advance', {
      type: Sequelize.INTEGER,
      allowNull: false, // o false, dependiendo de tus necesidades
      defaultValue: 0,
    });
    await queryInterface.addColumn('reservations', 'pending_payment', {
      type: Sequelize.INTEGER,
      allowNull: false, // o false, dependiendo de tus necesidades
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reservations', 'advance');
    await queryInterface.removeColumn('reservations', 'pending_payment');
  }
};
