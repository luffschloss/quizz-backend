const express = require("express");
const resultService = require("../service/result.service");
const resultDetailService = require("../service/result_detail.service");
const { authorize } = require("../extension/middleware/application.middleware");
const authService = require("../service/common/auth.common.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const commonService = require("../service/common.service");
const router = express.Router();
//get all test-credit-class
router.get("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    console.log(userId);
    res.send(await resultService.getAll(userId));
  }
});

router.get("/filter", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    console.log(userId);
    console.log(req.query);
    res.send(await resultService.getAllFilter(userId, req.query));
  }
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.getByUserId(id));
});

router.get("/test-credit-classes/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.getByTestCreditClassesId(id));
});

router.get("/test-credit-classes/chart/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.getChartByTestCreditClassesId(id));
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("get here");
  res.send(await resultService.getOne(id));
});

router.post("/export/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.exportTranscript(id));
});

router.post("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = authService.getUserIdFromJWTToken(
    accessToken,
    process.env.SECRET_TOKEN_KEY
  );
  if (!userId) {
    res.send(
      new BaseAPIResponse(
        "NOT AUTHORIZE",
        null,
        "Không có quyền truy cập tài nguyên"
      )
    );
  } else {
    const result = req.body;
    console.log(result);
    console.log(userId);
    result.user_id = userId;
    res.send(await resultService.create(result));
    //res.send(new BaseAPIResponse("SUCCESS", result, "Thanh cong"));
  }
});

router.put("/", async (req, res) => {
  const result = req.body;
  res.send(await resultService.update(result));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.delete(id));
});

/* Chi tiet ket qua */
router.get("/detail", async (req, res) => {
  res.send(await resultDetailService.getAll());
});

router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultDetailService.getOne(id));
});

router.post("/detail", async (req, res) => {
  const result = req.body;
  res.send(await resultDetailService.create(result));
});

router.put("/detail", async (req, res) => {
  const result = req.body;
  res.send(await resultDetailService.update(result));
});

router.delete("/detail/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultDetailService.delete(id));
});

module.exports = router;
