const express = require("express");
const subjectService = require("../service/subject.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { authorize } = require("../extension/middleware/application.middleware");
const { logger, Helpers } = require("../extension/helper");
const router = express.Router();
const { CONFIG } = require("../shared/common.constants");
const commonService = require("../service/common.service");

router.get("/", async (req, res) => {
  res.send(await subjectService.getAll());
});

router.get("/user", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await subjectService.getAllByUserId(userId));
  }
});
//Lấy môn học được quyền tạo câu hỏi, cho GV.
router.get("/user/dropdown", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await subjectService.getSubjectDropdownByUserId(userId));
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await subjectService.getOne(id));
});

router.post("/", async (req, res) => {
  const subject = req.body;
  res.send(await subjectService.create(subject));
});

router.put("/", async (req, res) => {
  const subject = req.body;
  res.send(await subjectService.update(subject));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await subjectService.delete(id));
});

module.exports = router;
