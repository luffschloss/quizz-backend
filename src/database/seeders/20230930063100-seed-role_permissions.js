"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("role_permissions", [
      {
        id: 1,
        role_id: "3c4d-7ab3-e1d7-a853-e449-99f9-3273-b5db",
        permission_id: 1,
      },
      {
        id: 2,
        role_id: "3c4d-7ab3-e1d7-a853-e449-99f9-3273-b5db",
        permission_id: 2,
      },
      {
        id: 3,
        role_id: "6157-c170-af3d-184a-d5ea-13c0-d273-c507",
        permission_id: 1,
      },
      {
        id: 4,
        role_id: "6157-c170-af3d-184a-d5ea-13c0-d273-c507",
        permission_id: 2,
      },
      {
        id: 5,
        role_id: "c7f5-fe05-2875-f504-af5b-d25b-2d6c-0f39",
        permission_id: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role_permissions");
  },
};
