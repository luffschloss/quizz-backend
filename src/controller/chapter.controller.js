const express = require("express");
const chapterService = require("../service/chapter.service");
const commonService = require("../service/common.service");
const { authorize } = require("../extension/middleware/application.middleware");
const router = express.Router();

router.get("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await chapterService.getAll(userId));
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await chapterService.getOne(id));
});

router.get("/subject/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await chapterService.getBySubjectId(id));
});

router.post("/", async (req, res) => {
  const subject = req.body;
  res.send(await chapterService.create(subject));
});

router.put("/", async (req, res) => {
  const subject = req.body;
  res.send(await chapterService.update(subject));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await chapterService.delete(id));
});

module.exports = router;
