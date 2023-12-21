const express = require("express");
const testService = require("../service/test.service");
const { authorize } = require("../extension/middleware/application.middleware");
const authService = require("../service/common/auth.common.service");
const commonService = require("../service/common.service");
const router = express.Router();

router.post("/export/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.export(id));
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.getAllTestByUserId(id));
});
/* API giao đề thi cho từng nhóm */
router.get("/credit-class", async (req, res) => {
  res.send(await testService.getTestClasses());
});
router.get("/credit-class/:id", authorize([]), async (req, res) => {
  const id = req.params.id;
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await testService.getTestClassByTestId(id, userId));
  }
});
router.post("/credit-class", async (req, res) => {
  const testClass = req.body;
  res.send(await testService.createTestClass(testClass));
});
/*
Nếu đã có bài nộp thì không được sửa
*/
router.put("/credit-class", async (req, res) => {
  const testClass = req.body;
  res.send(await testService.updateTestClass(testClass));
});
/*
Nếu có bài làm rồi thì sẽ không được xóa.
Admin or người tạo có thể xóa
*/
router.delete("/credit-class/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.deleteTestClass(id));
});

/* API CRUD câu hỏi cho đề thi */
router.post("/question", async (req, res) => {
  const testQuestion = req.body;
  res.send(await testService.createTestQuestion(testQuestion));
});

router.put("/question", async (req, res) => {
  const testQuestion = req.body;
  res.send(await testService.updateTestQuestion(testQuestion));
});

router.put("/detail", authorize([]), async (req, res) => {
  const { questions, id } = req.body;
  res.send(await testService.updateTestDetail(questions, id));
});

router.delete("/question/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.deleteTestQuestion(id));
});
//
router.get("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await testService.getAll(userId));
  }
});

router.get("/filter", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await testService.getAllFilter(userId, req.query));
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.getOne(id));
});

router.post("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = authService.getUserIdFromJWTToken(
    accessToken,
    process.env.SECRET_TOKEN_KEY
  );
  const test = req.body;
  test.user_id = userId;
  res.send(await testService.create(test));
});

router.post("/manual", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    const { test, questions } = req.body;
    test.user_id = userId;
    res.send(await testService.createManual(test, questions));
  }
});

router.put("/", async (req, res) => {
  const test = req.body;
  res.send(await testService.update(test));
});

router.delete("/:id", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  const id = req.params.id;
  if (userId) {
    res.send(await testService.delete(id));
  }
});

module.exports = router;
