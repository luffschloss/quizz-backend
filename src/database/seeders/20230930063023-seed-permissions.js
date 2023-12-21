"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("permissions", [
      {
        id: 1,
        name: "admin",
        nomalize: "ADMIN",
      },
      {
        id: 2,
        name: "gv",
        nomalize: "GV",
      },
      {
        id: 3,
        name: "sv",
        nomalize: "SV",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions");
  },
};
