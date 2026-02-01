'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('fastrider_slots', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('fastrider_slots', 'updated_at');
  },
};
