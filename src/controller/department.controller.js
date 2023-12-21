const express = require("express");
const departmentService = require("../service/department.service");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await departmentService.getAll());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await departmentService.getOne(id));
});

router.post("/", async (req, res) => {
  const subject = req.body;
  res.send(await departmentService.create(subject));
});

router.put("/", async (req, res) => {
  const subject = req.body;
  res.send(await departmentService.update(subject));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await departmentService.delete(id));
});

module.exports = router;
