'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add association between User and Chat_room
    await queryInterface.createTable('User_ChatRooms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      chatRoomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chat_rooms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    // Add association between Item and Tag
    await queryInterface.createTable('Item_tags', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      ItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      TagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove association between User and Chat_room
    await queryInterface.dropTable('User_ChatRoom');

    // Remove association between Item and Tag
    await queryInterface.dropTable('Item_tag');
  }
};
