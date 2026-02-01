'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fastrider_tickets', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      slot_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'fastrider_slots',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'USED', 'CANCELLED'),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });

    // Enforce one ACTIVE ticket per user
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX one_active_ticket_per_user
      ON fastrider_tickets (user_id)
      WHERE status = 'ACTIVE';
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('fastrider_tickets');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_fastrider_tickets_status";'
    );
  }
};
