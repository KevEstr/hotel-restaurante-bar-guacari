"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("Roles", [
            {
                name: "Mesero",
                description: "Responsable de tomar órdenes y servir mesas.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Administrador",
                description: "Responsable de la gestión del sistema.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // Otros roles...
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Roles", null, {});
    },
};