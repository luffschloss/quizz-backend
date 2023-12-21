"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user_roles", [
      {
        id: 1,
        user_id: "11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23",
        role_id: "3c4d-7ab3-e1d7-a853-e449-99f9-3273-b5db",
      },
      {
        id: 2,
        user_id: "e0d2-446f-6170-e42e-e085-64a9-0467-2b33",
        role_id: "6157-c170-af3d-184a-d5ea-13c0-d273-c507",
      },
      {
        id: 3,
        user_id: "bc7d-1e2d-863b-0256-7539-dc5e-cc3e-899e",
        role_id: "c7f5-fe05-2875-f504-af5b-d25b-2d6c-0f39",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_roles");
  },
};
