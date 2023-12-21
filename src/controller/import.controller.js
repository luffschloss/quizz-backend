const express = require("express");
const subjectService = require("../service/subject.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { authorize } = require("../extension/middleware/application.middleware");
const { logger, Helpers } = require("../extension/helper");
const router = express.Router();
const { CONFIG } = require("../shared/common.constants");
const { uploadUtil } = require("../util/upload.util");
const { readPdfFromBuffer, pdfUtil } = require("../util/pdf/readPdfUtil");
const importService = require("../service/import.service");

router.post("/", async (req, res) => {
  await importService.import();
  res.send(
    new BaseAPIResponse(
      CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
      null,
      "Import teamplate question success"
    )
  );
});

module.exports = router;
