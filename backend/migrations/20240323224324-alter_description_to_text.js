"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Items", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // This migration will not handle reverting back to VARCHAR(255)
    // If you need to revert, you might need to create a separate migration
    // Or adjust this migration to store the old data and restore it
  },
};
