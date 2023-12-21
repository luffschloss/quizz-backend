const express = require("express");
const assignService = require("../service/assign.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { authorize } = require("../extension/middleware/application.middleware");
const { logger, Helpers } = require("../extension/helper");
const router = express.Router();
const { CONFIG } = require("../shared/common.constants");
const commonService = require("../service/common.service");

//get numOfTotalQuestion, numOfTotalTest, numOfTotalTestExam, numOfTotalUser
router.get("/overview/info", async (req, res) => {
  res.send(await commonService.getFourTopInfo());
});

router.get("/overview/user/info/:id", async (req, res) => {
  res.send(await commonService.getFourTopUserInfo(req.params.id));
});

router.get("/overview/pie", async (req, res) => {
  res.send(await commonService.getPieChartMark());
});

router.get("/overview/bar", async (req, res) => {
  res.send(await commonService.getBarChartSemester());
});

router.get("/role", async (req, res) => {
  res.send(await commonService.getRoles());
});

router.get("/role/permission/:id", async (req, res) => {
  res.send(await commonService.getPermissonByRole(req.params.id));
});

router.get("/role/user/:id", async (req, res) => {
  res.send(await commonService.getUserByRole(req.params.id));
});

router.put("/permission", async (req, res) => {
  res.send(await commonService.putPermission(req.body));
});

router.put("/role", async (req, res) => {
  res.send(await commonService.putRole(req.body));
});

router.post("/role/user", async (req, res) => {
  res.send(await commonService.addUserToRole(req.body));
});

router.delete("/role/permission/:id", async (req, res) => {
  res.send(await commonService.deleteRolePermissions(req.params.id));
});

router.delete("/role/user/:id", async (req, res) => {
  res.send(await commonService.deleteUserRoles(req.params.id));
});

router.get("/cluster", async (req, res) => {
  res.send(await commonService.getClusters());
});
router.get("/user-cluster-subject/user", async (req, res) => {
  res.send(await commonService.getUsers());
});
router.get("/user-cluster-subject/subject/user/:id", async (req, res) => {
  res.send(await commonService.getSubjectByUserId(req.params.id));
});

router.delete("/user-cluster-subject/:id", async (req, res) => {
  res.send(await commonService.deleteUserClusterSubject(req.params.id));
});
router.get("/user-cluster-subject/user/:id", async (req, res) => {
  res.send(await commonService.getUserClusterSubjectByUserId(req?.params?.id));
});

router.post("/user-cluster-subject", async (req, res) => {
  res.send(await commonService.createUserClusterSubject(req.body));
});

module.exports = router;
