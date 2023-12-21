const userRepository = require("../repository/user.repository");
const { getUserIdFromJWTToken } = require("../extension/middleware/index");
var jwt = require("jsonwebtoken");
const path = require("path");
const authService = require("./common/auth.common.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const sendMailService = require("./common/sendmail.service");
const { Helpers, logger } = require("../extension/helper");
const commonService = require("./common.service");
const { CONSTANTS } = require("../shared/constant");
const { URL_CONFIG } = require("../shared/url.constant");
const clusterRepository = require("../repository/cluster.repository");
const userClusterSubjectRepository = require("../repository/user_cluster_subject.repository");
const xlsx = require("xlsx");
const fs = require("fs");
const permissions = require("../database/models/permissions");
const { log } = require("console");
const { FILTER_CONST } = require("../shared/filter.constant");
module.exports = {
  create: async (user) => {
    const userByEmail = await userRepository.getByEmail(user.email);
    if (userByEmail) {
      throw new Error("Email đã được sử dụng, vui lòng chọn email khác");
    }
    user.passwordHash = authService.hashPassword(user.password);
    user.code = user.email?.split("@")[0].toUpperCase();
    const userCreate = await userRepository.create(user);
    if (user.type === CONSTANTS.USER.TYPE.GV) {
      const userCluster = await clusterRepository.create({
        id: 0,
        user_id: userCreate.dataValues.id,
      });
    }
    return userCreate;
  },
  login: async (userLogin) => {
    const { email, password } = userLogin;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    // if (user.type === CONSTANTS.USER.TYPE.SV) {
    //   throw new Error("Không có quyền đăng nhập");
    // }
    const isPasswordCorrect = authService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    user.roles = await userRepository.getRoles(user.id);
    if (user.roles) {
      let permissions = [];
      for (let r of user.roles) {
        permissions.push(...(await userRepository.getPemissions(r.id)));
      }
      if (
        permissions.length === 0 ||
        permissions?.filter(
          (p) =>
            p.name == CONFIG.PERMISSION.ADMIN || p.name == CONFIG.PERMISSION.GV
        ).length === 0
      ) {
        throw new Error("Không có quyền đăng nhập");
      }
      user.permissions = permissions;
    }
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  loginMobile: async (userLogin) => {
    const { email, password } = userLogin;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    if (user.type !== CONSTANTS.USER.TYPE.SV) {
      throw new Error("Không có quyền đăng nhập");
    }
    const isPasswordCorrect = authService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    user.roles = await userRepository.getRoles(user.id);
    if (user.roles) {
      let permissions = [];
      for (let r of user.roles) {
        permissions.push(await userRepository.getPemissions(r.id));
      }
      user.permissions = permissions;
    }
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  refreshToken: async (id, token) => {
    try {
      const user = await userRepository.getById(id);
      if (!user) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
      }
      const isTokenValid = authService.verifyToken(
        token,
        process.env.REFRESH_TOKEN_KEY
      );
      console.log("isTokenValid", isTokenValid);
      if (!isTokenValid) {
        return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, "");
      } else {
        const accessToken = authService.generateAccessToken(user.id);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          {
            refreshToken: token,
            accessToken: accessToken,
          },
          ""
        );
      }
    } catch (err) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  logOut: (req, res, next) => {
    const { _id } = req.data;
    new User()
      .logOut()
      .then((data) => {
        console.log(data);
        return res
          .status(201)
          .json({ message: "logout success", isSuccess: true });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(401)
          .json({ message: "logout success", isSuccess: false, err });
      });
  },
  getAll: async () => {
    var users = await userRepository.getAll();
    users.forEach((user) => {
      user.avatar = user.avatar ? user.avatar.toString("base64") : user.avatar;
    });
    return users;
  },
  getAllFilter: async (filterData) => {
    try {
      let queryArr = [];
      for (let item of Object.keys(filterData)) {
        if (filterData[item] && filterData[item].length > 0) {
          switch (item) {
            case FILTER_CONST.SEARCH:
              queryArr.push(
                `(us.firstName LIKE '%${filterData[item]}%' OR us.lastName LIKE '%${filterData[item]}%' OR us.email LIKE '%${filterData[item]}%' OR us.code LIKE '%${filterData[item]}%')`
              );
              break;
            case FILTER_CONST.GENDER:
              queryArr.push(`us.gender='${filterData[item]}'`);
              break;
            case FILTER_CONST.TYPE:
              queryArr.push(`us.type='${filterData[item]}'`);
              break;
            default:
              break;
          }
        }
      }
      const query =
        queryArr.length > 0 ? ` WHERE ${queryArr.join(" AND ")}` : "";
      const users = await userRepository.getAllFilter(query);
      users.forEach((user) => {
        user.avatar = user.avatar
          ? user.avatar.toString("base64")
          : user.avatar;
      });
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        users,
        CONFIG.RESPONSE_MESSAGE.SUCCESS
      );
    } catch (err) {
      logger.error(`get user filter error: ${err.message}`);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        CONFIG.RESPONSE_MESSAGE.ERROR
      );
    }
  },
  getAllByType: async (type) => {
    try {
      const users = await userRepository.getByType(type);
      users.forEach((user) => {
        user.avatar = user.avatar
          ? user.avatar.toString("base64")
          : user.avatar;
      });
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        users,
        "Get user list success"
      );
    } catch (err) {
      logger.error(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "Failed when get users"
      );
    }
  },
  getById: async (id) => {
    const user = await userRepository.getById(id);
    user.roles = await userRepository.getRoles(user.id);
    if (user.roles) {
      let permissions = [];
      for (let r of user.roles) {
        permissions.push(await userRepository.getPemissions(r.id));
      }
      user.permissions = permissions;
    }
    return user;
  },
  update: async (userUpdate) => {
    const { email, password } = userUpdate;
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    const isPasswordCorrect = authService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
    }
    const userId = await userRepository.getById(user.id);
    await userRepository.update(userId);
    const accessToken = authService.generateAccessToken(user.id);
    const refreshToken = authService.generateRefreshToken(user.id);
    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  changePasswordController: async (userId, userPassword, token) => {
    try {
      const { oldPassword, newPassword } = userPassword;
      const user = await userRepository.getById(userId);
      if (!user) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
      }
      const isPasswordCorrect = authService.comparePassword(
        oldPassword,
        user.passwordHash
      );
      if (!isPasswordCorrect) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.LOGIN);
      }
      const newPasswordHash = authService.hashPassword(newPassword);
      user.passwordHash = newPasswordHash;
      await userRepository.update(user);
      return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, user, "");
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  forgotPassword: async (user) => {
    const { email } = user;
    const userEmail = await userRepository.getByEmail(email);
    if (!userEmail) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.FORGOT_PASSWORD);
    }
    const userExists = await userRepository.getById(userEmail.id);
    const resetPasswordToken = userExists.resetPasswordToken;
    if (resetPasswordToken) {
      console.log(resetPasswordToken);
      if (
        authService.verifyToken(
          resetPasswordToken,
          process.env.RESET_PASSWORD_TOKEN_KEY
        )
      ) {
        logger.error("resetPasswordToken still expiredin");
        throw new Error("Token thay đổi mật khẩu vẫn đang còn hiệu lực");
      }
    }
    const newResetPasswordToken = authService.generateResetPasswordToken(
      userExists.id
    );
    console.log("begin send mail", new Date());
    const result = await sendMailService.SendMailHTML(
      userExists.email,
      CONFIG.API_MESSAGE.USER.FORGOT_PASSWORD,
      `${URL_CONFIG.CORE_CLIENT_URL}${URL_CONFIG.RESET_PASSWORD}?token=${newResetPasswordToken}`
    );
    console.log("end send mail", new Date());
    if (result) userExists.resetPasswordToken = newResetPasswordToken;
    await userRepository.update(userExists);
    return result ? newResetPasswordToken : false;
  },
  confirmPassword: async (token, newPassword) => {
    console.log(token);
    if (!authService.verifyToken(token, process.env.RESET_PASSWORD_TOKEN_KEY)) {
      logger.error("token is expired");
      throw new Error("token is expired");
    }
    const userId = authService.getUserIdFromJWTToken(
      token,
      process.env.RESET_PASSWORD_TOKEN_KEY
    );
    if (!userId) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.CONFIRM_PASSWORD);
    }
    const user = await userRepository.getById(userId);
    if (!user || user.resetPasswordToken !== token) {
      throw new Error(CONFIG.ERROR_RESPONSE.USER.CONFIRM_PASSWORD);
    }
    const newPasswordHash = authService.hashPassword(newPassword);
    console.log("newPasswordHash", newPasswordHash);
    user.passwordHash = newPasswordHash;
    user.resetPasswordToken = null;
    await userRepository.update(user);
    return user;
  },
  getUser: (req, res, next) => {
    const { _id } = req.data;
    new User()
      .getUser()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  editProfile: (req, res, next) => {
    const { _id } = req.data;
    const { name, email, phone } = req.body;
    const file = req.file;
    new User()
      .putUser()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  updateAvatar: async (avatar, token) => {
    try {
      const userId = authService.getUserIdFromJWTToken(
        token,
        process.env.SECRET_TOKEN_KEY
      );
      if (!userId) {
        throw new Error(CONFIG.ERROR_RESPONSE.USER.TOKEN_INVALID);
      }
      const user = await userRepository.getById(userId);
      if (!user) {
        throw new Error("User is not exist");
      }
      user.avatar = avatar ? avatar.buffer : null;
      const userUpdate = await userRepository.update(user);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        userUpdate,
        "Thay đổi ảnh đại diện thành công"
      );
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  updateInformation: async (userInfo, avatar, token) => {
    try {
      const user = await userRepository.getById(userInfo?.id);
      if (!user) {
        throw new Error("User is not exist");
      }
      if (avatar) {
        user.avatar = avatar.buffer;
      }
      user.firstName = userInfo.firstName;
      user.lastName = userInfo.lastName;
      user.dateOfBirth = userInfo.dateOfBirth;
      user.gender = userInfo.gender;
      user.email = userInfo.email;
      user.type = userInfo.type;
      const userUpdate = await userRepository.update(user);
      userUpdate.dataValues.roles = await userRepository.getRoles(
        userUpdate?.dataValues?.id
      );
      if (userUpdate?.dataValues?.roles) {
        let permissions = [];
        for (let r of userUpdate?.dataValues?.roles) {
          permissions.push(await userRepository.getPemissions(r.id));
        }
        userUpdate.dataValues.permissions = permissions;
      }
      console.log(userUpdate);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        userUpdate,
        "Cập nhật thông tin cá nhân thành công"
      );
    } catch (err) {
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  isAdmin: async (id) => {
    const user = await getById(id);
    if (!user) {
      return false;
    }
    const role = user.roles[0]?.name;
    if (role === CONFIG.ROLE.ADMIN) {
      return true;
    }
    return false;
  },
  delete: async (id, adminId) => {
    try {
      const delUserClusterSubject =
        await userClusterSubjectRepository.deleteByUserId(id);
      const delCluster = await clusterRepository.deleteByUserId(id);
      const result = await userRepository.delete(id, adminId);
      if (result) {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          null,
          null
        );
      } else {
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          "error"
        );
      }
    } catch (err) {
      logger.error(`delete user failed`);
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  /**
   *
   * @param {*} file
   * @returns
   */
  import: async (file) => {
    if (!file) {
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        "Không có file nào được chọn"
      );
    } else {
      try {
        const workBook = xlsx.read(file.buffer, { type: "buffer" });
        const sheet = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheet];

        const jsonData = xlsx.utils.sheet_to_json(workSheet);
        let total = jsonData.length;
        let successQ = 0,
          failedQ = 0;
        for (let row of jsonData) {
          console.log("row bang: ", row);
          try {
            const userCreate = await userRepository.create({
              firstName: row.firstName,
              lastName: row.lastName,
              email: row.email,
              type:
                row.type === "Giảng viên"
                  ? CONSTANTS.USER.TYPE.GV
                  : CONSTANTS.USER.TYPE.SV,
              passwordHash: authService.hashPassword(
                CONSTANTS.USER.DEFAULT_PASSWORD
              ),
              code: row.email?.split("@")[0].toUpperCase(),
              dateOfBirth: row.dateOfBirth,
            });
            if (userCreate.type === CONSTANTS.USER.TYPE.GV) {
              const userCluster = await clusterRepository.create({
                id: 0,
                user_id: userCreate.dataValues.id,
              });
            }
            successQ++;
          } catch (err) {
            logger.error(err);
            failedQ++;
          }
        }

        let resWorkBook = xlsx.utils.book_new();
        let sheetName = "Kết quả import";
        const resSheet = xlsx.utils.aoa_to_sheet([
          ["Kết quả import người dùng vào hệ thống", ""],
          ["Thời gian", new Date().toString()],
          ["Tổng số tài khoản được import", total],
          ["Thành công", successQ],
          ["Thất bại", failedQ],
        ]);
        xlsx.utils.book_append_sheet(resWorkBook, resSheet, sheetName);
        const exportFilePath = "question_import_result.xlsx";
        xlsx.writeFile(resWorkBook, exportFilePath);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
          fs.readFileSync("question_import_result.xlsx", {
            encoding: "base64",
          }),
          "ok"
        );
      } catch (err) {
        logger.error(`import question failed`);
        console.log(err);
        return new BaseAPIResponse(
          CONFIG.RESPONSE_STATUS_CODE.ERROR,
          null,
          err.message
        );
      }
    }
  },
};
