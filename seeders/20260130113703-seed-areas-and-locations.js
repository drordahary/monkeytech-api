'use strict';

module.exports = {
  async up(queryInterface) {
    const [areas] = await queryInterface.bulkInsert(
      'areas',
      [
        { id: '11111111-1111-1111-1111-111111111111', name: 'Gibbon Island' },
        { id: '22222222-2222-2222-2222-222222222222', name: 'Capuchin Hills' }
      ],
      { returning: true }
    );

    await queryInterface.bulkInsert('locations', [
      {
        area_id: '11111111-1111-1111-1111-111111111111',
        name: 'Jungle Coaster',
        type: 'ATTRACTION',
        supports_fastrider: true,
        avg_wait_time: 45
      },
      {
        area_id: '22222222-2222-2222-2222-222222222222',
        name: 'Monkey Snacks',
        type: 'FOOD'
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('locations', null, {});
    await queryInterface.bulkDelete('areas', null, {});
  }
};
