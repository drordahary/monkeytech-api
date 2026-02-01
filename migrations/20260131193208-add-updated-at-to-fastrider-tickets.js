'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('fastrider_tickets', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('fastrider_tickets', 'updated_at');
  },
};
