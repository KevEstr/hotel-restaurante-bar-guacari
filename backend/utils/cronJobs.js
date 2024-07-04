const cron = require('node-cron');
const { Client } = require('../models');
const { Op } = require('sequelize');

// Define the cron job to run every minute for testing
cron.schedule('0 0 * * *', async () => {
  const threeWeeksAgo = new Date();
threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21); // Resta 21 días para 3 semanas
    

  try {
    // Log the condition for debugging purposes
    const condition = {
      has_order: false,
      has_reservation: false,
      updatedAt: {
        [Op.lt]: threeWeeksAgo,
      },
    };
    console.log('Updating clients with condition:', condition);

    // Check clients that meet individual conditions
    const clientsNoOrder = await Client.findAll({ where: { has_order: false } });
    console.log('Clients with has_order false:', clientsNoOrder.length);

    const clientsNoReservation = await Client.findAll({ where: { has_reservation: false } });
    console.log('Clients with has_reservation false:', clientsNoReservation.length);

    const clientsOldUpdated = await Client.findAll({
      where: {
        updatedAt: {
          [Op.lt]: oneWeekAgo,
        },
      },
    });
    console.log('Clients with updatedAt older than one week:', clientsOldUpdated.length);

    // Log clients that meet the combined condition before update
    const clientsToUpdate = await Client.findAll({ where: condition });
    console.log('Clients to be updated:', clientsToUpdate.length);

    // Perform the update
    const [numberOfAffectedRows] = await Client.update(
      { is_active: false },
      { where: condition }
    );
    console.log(`Number of clients updated: ${numberOfAffectedRows}`);

    // Log clients after update
    const updatedClients = await Client.findAll({ where: { ...condition, is_active: false } });
    console.log('Updated clients:', updatedClients.length);

  } catch (error) {
    console.error('Error updating inactive clients:', error);
  }
});
