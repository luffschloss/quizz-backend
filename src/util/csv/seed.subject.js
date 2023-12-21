const fs = require("fs");
const csv_parser = require("csv-parse");
const path = require("path");
const userRepository = require("../../repository/user.repository");
const subjectRepository = require("../../repository/subject.repository");

const filePath = path.join(__dirname, "../../../public/seed_data/subject.csv");
const subjectPath = path.join(
  __dirname,
  "../../../public/seed_data/monhoc.csv"
);

module.exports.csv_parser = {
  parser: () => {
    let result = [];
    fs.createReadStream(subjectPath, { encoding: "utf-8" })
      .pipe(csv_parser.parse({ delimiter: "," }))
      .on("data", (data) => {
        data ? result.push(data) : "";
      })
      .on("end", () => {
        result.forEach(async (item) => {
          console.log(item[2]);
          const subject = {
            name: item[2],
            credit: 3,
            theoretical_lesson: 30,
            pratical_lesson: 15,
          };
          await subjectRepository.create(subject);
        });
      });
  },
};
