const express = require("express");
const creditClassService = require("../service/credit_class.service");
const creditClassDetailService = require("../service/credit_classes_detail.service");
const { uploadUtil } = require("../util/upload.util");
const commonService = require("../service/common.service");
const { authorize } = require("../extension/middleware/application.middleware");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await creditClassService.getAll());
});

router.get("/user", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await creditClassService.getAllByUserId(userId));
  }
});

router.get("/assign/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.getAllAssign(id));
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.getOne(id));
});

router.post("/", async (req, res) => {
  const creditClass = req.body;
  res.send(await creditClassService.create(creditClass));
});

router.put("/", async (req, res) => {
  const creditClass = req.body;
  res.send(await creditClassService.update(creditClass));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.delete(id));
});
//
/**/
router.get("/gv/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.getGVByCreditClassId(id));
});
router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassDetailService.getListUserClass(id));
});
router.post("/user", async (req, res) => {
  const user_class = req.body;
  res.send(await creditClassDetailService.createUserClass(user_class));
});

router.post("/user/list", async (req, res) => {
  const data = req.body;
  res.send(await creditClassDetailService.createListUserClass(data));
});

router.post(
  "/user/import",
  authorize([]),
  uploadUtil.upload.single("file"),
  async (req, res) => {
    console.log(req.body.id);
    const creditClassId = req.body.id;
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
      res.send(await creditClassService.import(file, creditClassId));
    }
  }
);

router.put("/user", async (req, res) => {
  const group = req.body;
  res.send(await creditClassDetailService.banUserGroup(group));
});

router.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassDetailService.deleteUserClass(id));
});

module.exports = router;
