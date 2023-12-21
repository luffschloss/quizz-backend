'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('semesters', [
      { id: 1, semester: 1, year: 2010 },
      { id: 2, semester: 2, year: 2010 },
      { id: 3, semester: 3, year: 2010 },
      { id: 4, semester: 1, year: 2011 },
      { id: 5, semester: 2, year: 2011 },
      { id: 6, semester: 3, year: 2011 },
      { id: 7, semester: 1, year: 2012 },
      { id: 8, semester: 2, year: 2012 },
      { id: 9, semester: 3, year: 2012 },
      { id: 10, semester: 1, year: 2013 },
      { id: 11, semester: 2, year: 2013 },
      { id: 12, semester: 3, year: 2013 },
      { id: 13, semester: 1, year: 2014 },
      { id: 14, semester: 2, year: 2014 },
      { id: 15, semester: 3, year: 2014 },
      { id: 16, semester: 1, year: 2015 },
      { id: 17, semester: 2, year: 2015 },
      { id: 18, semester: 3, year: 2015 },
      { id: 19, semester: 1, year: 2016 },
      { id: 20, semester: 2, year: 2016 },
      { id: 21, semester: 3, year: 2016 },
      { id: 22, semester: 1, year: 2017 },
      { id: 23, semester: 2, year: 2017 },
      { id: 24, semester: 3, year: 2017 },
      { id: 25, semester: 1, year: 2018 },
      { id: 26, semester: 2, year: 2018 },
      { id: 27, semester: 3, year: 2018 },
      { id: 28, semester: 1, year: 2019 },
      { id: 29, semester: 2, year: 2019 },
      { id: 30, semester: 3, year: 2019 },
      { id: 31, semester: 1, year: 2020 },
      { id: 32, semester: 2, year: 2020 },
      { id: 33, semester: 3, year: 2020 },
      { id: 34, semester: 1, year: 2021 },
      { id: 35, semester: 2, year: 2021 },
      { id: 36, semester: 3, year: 2021 },
      { id: 37, semester: 1, year: 2022 },
      { id: 38, semester: 2, year: 2022 },
      { id: 39, semester: 3, year: 2022 },
      { id: 40, semester: 1, year: 2023 },
      { id: 41, semester: 2, year: 2023 },
      { id: 42, semester: 3, year: 2023 }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('semesters');
  }
};
