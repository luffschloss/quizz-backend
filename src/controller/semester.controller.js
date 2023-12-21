const express = require("express");
const semesterService = require("../service/semester.service");
const router = express.Router();

router.get("/", async (req, res) => {
  const { semester, year } = req.query;
  res.send(await semesterService.getAll(semester, year));
});

router.get("/year", async (req, res) => {
  res.send(await semesterService.getAllYear());
});

router.get("/semester", async (req, res) => {
  res.send(await semesterService.getAllSemester());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await semesterService.getOne(id));
});

router.post("/", async (req, res) => {
  const semester = req.body;
  res.send(await semesterService.create(semester));
});

router.put("/", async (req, res) => {
  const semester = req.body;
  res.send(await semesterService.update(semester));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await semesterService.delete(id));
});

module.exports = router;
