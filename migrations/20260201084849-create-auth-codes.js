'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_codes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      phone: { type: Sequelize.STRING(32), allowNull: false },
      code_hash: { type: Sequelize.STRING(128), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      consumed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('auth_codes', ['phone']);
    await queryInterface.addIndex('auth_codes', ['expires_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auth_codes');
  },
};
