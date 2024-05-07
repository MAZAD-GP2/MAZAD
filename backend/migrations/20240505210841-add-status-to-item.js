"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Auctions", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "new",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Auctions", "status");
  },
};
