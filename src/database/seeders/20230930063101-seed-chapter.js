"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const listId = [
      "21fb-43ff-38a0-7b5e-7d9d-5e9e-8083-9e6c",
      "30c3-532c-fe95-6e28-f406-ce4e-bc0c-42b0",
      "4487-1ab5-3db9-efc3-b0ff-5e77-56db-9542",
      "4bdb-215e-883c-3761-8c8d-6fa8-bf72-41a7",
      "6f38-3b10-3e5a-6e65-dfee-b21a-1651-c802",
      "92e9-cc94-0b41-04f6-53cf-61db-5c15-8425",
      "b4a1-400a-3e8f-4a18-e972-38e8-e68a-2696",
      "af83-1733-51a0-946f-2be0-71a8-9cae-bbda",
      "c03c-d3bf-b8fd-2a67-f765-38a8-111e-22c0",
    ];
    const insertChapters = [];
    for (let i = 0; i < listId.length; i++) {
      for (let j = 1; j <= 5; j++) {
        insertChapters.push({
          id: i * 5 + j,
          name: `Chương ${j}`,
          index: j,
          subject_id: listId[i],
        });
      }
    }
    await queryInterface.bulkInsert("chapters", insertChapters);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("chapters");
  },
};
