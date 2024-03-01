'use strict';
const { User, Chat_room, Item, Tag} = require('../models');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create User_Item table for User hasMany Item relationship
    await queryInterface.addColumn(
      'Items',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );
  
    await queryInterface.addColumn(
      'Bids',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );
    
    await queryInterface.addColumn(
      'Comments',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    await queryInterface.addColumn(
      'Interests',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );
    
    await queryInterface.addColumn(
      'Interests',
      'itemId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    await queryInterface.addColumn(
      'Comments',
      'itemId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    await queryInterface.addColumn(
      'Auctions',
      'itemId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    await queryInterface.addColumn(
      'Items',
      'categoryId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );
    
    await queryInterface.addColumn(
      'Bids',
      'AuctionId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Auctions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );
    
    await queryInterface.addColumn(
      'Messages',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    await queryInterface.addColumn(
      'Messages',
      'chatRoomId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chat_rooms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    await queryInterface.addColumn(
      'Images',
      'itemId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    );

    // Add other constraints for foreign keys
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Items', 'userId');
    await queryInterface.removeColumn('Bids', 'userId');
    await queryInterface.removeColumn('Comments', 'userId');
    await queryInterface.removeColumn('Interests', 'userId');
    await queryInterface.removeColumn('Interests', 'itemId');
    await queryInterface.removeColumn('Comments', 'itemId');
    await queryInterface.removeColumn('Auctions', 'itemId');
    await queryInterface.removeColumn('Items', 'categoryId');
    await queryInterface.removeColumn('Bids', 'AuctionId');
    await queryInterface.removeColumn('Messages', 'userId');
    await queryInterface.removeColumn('Messages', 'chatRoomId');
    await queryInterface.removeColumn('Images', 'itemId');
  }
};
