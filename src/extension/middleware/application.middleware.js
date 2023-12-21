const BaseAPIResponse = require("../../dto/baseApiResponse");
const authService = require("../../service/common/auth.common.service");
const { Helpers } = require("../helper");

module.exports = {
  checkData: (req, res, next) => {
    if (true) res.json({ success: false });
  },
  authorize: (permissions) => {
    return (req, res, next) => {
      const auth = req.headers.authorization;
      const token = auth.split(" ")[1];
      console.log(token);
      console.log(process.env.SECRET_TOKEN_KEY);
      if (!req.headers.authorization) {
        res.send(
          new BaseAPIResponse(
            "NOT AUTHORIZE",
            null,
            "Không có quyền truy cập tài nguyên"
          )
        );
      } else if (
        !authService.verifyToken(token, process.env.SECRET_TOKEN_KEY)
      ) {
        res.send(
          new BaseAPIResponse(
            "NOT AUTHORIZE",
            null,
            "Không có quyền truy cập tài nguyên"
          )
        );
      } else {
        console.log("pass middleware");
        req.accessToken = token;
        next();
      }
    };
  },
};
