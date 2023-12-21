const { URL_CONFIG } = require("../shared/url.constant");

module.exports = (api) => {
  api.use(`${URL_CONFIG.API_V1}/user`, require("./user.controller"));
  api.use(`${URL_CONFIG.API_V1}/subject`, require("./subject.controller"));
  api.use(`${URL_CONFIG.API_V1}/chapter`, require("./chapter.controller"));
  api.use(`${URL_CONFIG.API_V1}/question`, require("./question.controller"));
  api.use(`${URL_CONFIG.API_V1}/semester`, require("./semester.controller"));
  api.use(
    `${URL_CONFIG.API_V1}/credit-class`,
    require("./credit_class.controller")
  );
  api.use(`${URL_CONFIG.API_V1}/test`, require("./test.controller"));
  api.use(
    `${URL_CONFIG.API_V1}/test-credit-classes`,
    require("./test_credit_classes.controller")
  );
  api.use(
    `${URL_CONFIG.API_V1}/test-schedule`,
    require("./test_schedule.controller")
  );
  api.use(`${URL_CONFIG.API_V1}/result`, require("./result.controller"));
  api.use(`${URL_CONFIG.API_V1}/assign`, require("./assign.controller"));
  api.use(`${URL_CONFIG.API_V1}/import`, require("./import.controller"));
  api.use(`${URL_CONFIG.API_V1}/common`, require("./common.controller"));
  api.use(
    `${URL_CONFIG.API_V1}/department`,
    require("./department.controller")
  );
};
