const dayjs = require("dayjs");
module.exports.Helpers = {
  isEmail: (value) => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value),
  isPhone: (value) =>
    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value),
  cloneObject: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },
  parseObject: (obj) => {
    return JSON.parse(obj);
  },
  generateUiid: (length) => {
    let arrResult = [];
    for (let i = 0; i < length; i++) {
      arrResult.push(
        (((Math.random() + 1) * 0x10000) | 0).toString(16).substring(1)
      );
    }
    return arrResult.join("-");
  },
  getCurrentTime: () => {
    const now = new Date();
    return `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  },
  convertToDate: (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  },
  getAuthToken: (req) => {
    return req.headers.authorization.split(" ")[1] || undefined;
  },
  getRandomItemsFromArray: function getRandomItemsFromArray(array, count) {
    const shuffledArray = [...array]; // Create a copy of the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray.slice(0, count);
  },
};

module.exports.logger = {
  info: (message) => {
    console.info(
      `\x1b[34m ${this.Helpers.getCurrentTime()} - INFO - ${message}`
    );
    console.log("\x1b[37m");
  },
  error: (message) => {
    console.error(
      `\x1b[31m ${this.Helpers.getCurrentTime()} - ERROR - ${message}`
    );
    console.log("\x1b[37m");
  },
};
