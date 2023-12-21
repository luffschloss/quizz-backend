const express = require("express");
const testService = require("../service/test.service");
const { authorize } = require("../extension/middleware/application.middleware");
const router = express.Router();

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.getAllTestByUserId(id));
});
/* API giao đề thi cho từng nhóm */
router.get("/:id", async (req, res) => {
  res.send(await testService.getTestClassesById(req.params.id));
});
router.get("/credit-class/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.getTestClassByTestId(id));
});
router.post("/credit-class", async (req, res) => {
  const testClass = req.body;
  res.send(await testService.createTestClass(testClass));
});

module.exports = router;
