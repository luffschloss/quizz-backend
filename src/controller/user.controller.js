const express = require("express");
const userService = require("../service/user.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { authorize } = require("../extension/middleware/application.middleware");
const { logger, Helpers } = require("../extension/helper");
const router = express.Router();
const { CONFIG } = require("../shared/common.constants");
const { uploadUtil } = require("../util/upload.util");
const commonService = require("../service/common.service");
const { CONSTANTS } = require("../shared/constant");

router.post("/signup", uploadUtil.upload.single("avatar"), async (req, res) => {
  const user = req.body;
  const avatar = req.file;
  if (avatar) {
    user.avatar = avatar.buffer;
  }
  try {
    const response = await userService.create(user);
    res.send(
      new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, response, "")
    );
  } catch (err) {
    logger.error(
      `Singup failed - Email: "${user.email}" - Error: ${
        err.message || err.message
      }`
    );
    res.send(
      new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message || CONFIG.ERROR.VALIDATION_ERROR
      )
    );
  }
});

router.post("/login", async (req, res) => {
  const user = req.body;
  try {
    const response = await userService.login(user);
    res.send(
      new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, response, "")
    );
  } catch (err) {
    logger.error(
      `Login failed - Email: "${user.email}" - Error: ${err?.message}`
    );
    res.send(
      new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err?.message || CONFIG.ERROR.VALIDATION_ERROR
      )
    );
  }
});

router.post("/login/mobile", async (req, res) => {
  const user = req.body;
  try {
    const response = await userService.loginMobile(user);
    res.send(
      new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, response, "")
    );
  } catch (err) {
    logger.error(
      `Login failed - Email: "${user.email}" - Error: ${err?.message}`
    );
    res.send(
      new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err?.message || CONFIG.ERROR.VALIDATION_ERROR
      )
    );
  }
});

router.post("/forgot-password", async (req, res) => {
  const user = req.body;
  try {
    let status = CONFIG.RESPONSE_STATUS_CODE.SUCCESS;
    const response = await userService.forgotPassword(user);
    if (!response) status = CONFIG.RESPONSE_STATUS_CODE.ERROR;
    res.send(
      new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, response, "")
    );
  } catch (err) {
    logger.error(
      `Login failed - Email: "${user.email}" - Error: ${err?.message}`
    );
    res.send(
      new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err?.message || CONFIG.ERROR.VALIDATION_ERROR
      )
    );
  }
});

router.put("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const response = await userService.confirmPassword(token, newPassword);
    res.send(
      new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, response, "")
    );
  } catch (err) {
    console.error(err);
    logger.error(`confirm passs failed - Error: ${err?.message}`);
    res.send(
      new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err?.message || CONFIG.ERROR.VALIDATION_ERROR
      )
    );
  }
});

router.post("/refresh-token", async (req, res) => {
  const { id, token } = req.body;
  res.send(await userService.refreshToken(id, token));
});
router.get("/", async (req, res) => {
  res.send(
    new BaseAPIResponse(
      CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
      await userService.getAll(),
      ""
    )
  );
});
/**
 * filter data model
 * @{gender:"MALE",type:"SV", search:"search something"}
 */
router.get("/filter", async (req, res) => {
  console.log("req.query", req.query);
  res.send(await userService.getAllFilter(req.query));
});
//authorize([]),
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    let msg = "";
    if (!user) {
      msg = "user not found";
      logger.error(msg);
    }
    res.send(
      new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, user, msg)
    );
  } catch (err) {
    new BaseAPIResponse(
      CONFIG.RESPONSE_STATUS_CODE.ERROR,
      null,
      "Lỗi khi tải chi tiết tài khoản"
    );
  }
});
router.put("/avatar", uploadUtil.upload.single("avatar"), async (req, res) => {
  const token = Helpers.getAuthToken(req);
  const avatar = req.file;
  res.send(await userService.updateAvatar(avatar, token));
});
router.put("/password", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    const userPassword = req.body;
    const result = await userService.changePasswordController(
      userId,
      userPassword,
      accessToken
    );
    res.send(result);
  }
});
router.put("/", uploadUtil.upload.single("avatar"), async (req, res) => {
  const user = req.body;
  const avatar = req.file;
  const token = req.accessToken;
  res.send(await userService.updateInformation(user, avatar, token));
});
router.delete(
  "/:id",
  authorize([CONFIG.PERMISSION.ADMIN]),
  async (req, res) => {
    const id = req.params.id;
    const accessToken = req.accessToken;
    const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
    if (userId) {
      res.send(await userService.delete(id, userId));
    }
  }
);
router.get("/type/:type", async (req, res) => {
  const type = req.params.type;
  res.send(await userService.getAllByType(type));
});
router.post(
  "/import",
  authorize([]),
  uploadUtil.upload.single("file"),
  async (req, res) => {
    const accessToken = req.accessToken;
    const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
    if (userId) {
      const file = req.file;
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="import_question_result.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(await userService.import(file));
    }
  }
);
module.exports = router;
