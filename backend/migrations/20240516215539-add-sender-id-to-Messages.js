"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Messages", "senderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });
    await queryInterface.addColumn("Messages", "roomId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Chat_rooms",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Messages", "senderId");
    await queryInterface.removeColumn("Messages", "roomId");
  },
};
