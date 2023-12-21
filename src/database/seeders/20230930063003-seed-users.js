"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: "11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23",
        firstName: "Admin",
        lastName: "Account",
        code: "ADMIN",
        email: "admin@ptithcm.edu.vn",
        age: null,
        dateOfBirth: "1999-10-22",
        gender: "MALE",
        avatar: null,
        type: "GV",
        passwordHash: "JIaDhoDlWj9OnPmCso4/NYkuQCSClGjH84p9AWL/cPU=",
        refreshToken: null,
        oauthToken: null,
        resetPasswordToken: null,
      },
      {
        id: "e0d2-446f-6170-e42e-e085-64a9-0467-2b33",
        code: "GV",
        firstName: "Teacher",
        lastName: "Account",
        email: "gv@ptithcm.edu.vn",
        age: null,
        type: "GV",
        dateOfBirth: "2000-10-22",
        gender: "MALE",
        avatar: null,
        passwordHash: "JIaDhoDlWj9OnPmCso4/NYkuQCSClGjH84p9AWL/cPU=",
        refreshToken: null,
        oauthToken: null,
        resetPasswordToken: null,
      },
      {
        id: "bc7d-1e2d-863b-0256-7539-dc5e-cc3e-899e",
        firstName: "Student",
        lastName: "Account",
        code: "SV",
        email: "sv@student.ptithcm.edu.vn",
        age: null,
        dateOfBirth: "1988-10-22",
        gender: "MALE",
        avatar: null,
        type: "SV",
        passwordHash: "JIaDhoDlWj9OnPmCso4/NYkuQCSClGjH84p9AWL/cPU=",
        refreshToken: null,
        oauthToken: null,
        resetPasswordToken: null,
      },
    ]);

    await queryInterface.bulkInsert("clusters", [
      {
        id: 1,
        user_id: "11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23",
      },
      {
        id: 2,
        user_id: "e0d2-446f-6170-e42e-e085-64a9-0467-2b33",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
    await queryInterface.bulkDelete("clusters");
  },
};
