const { methods: commonService } = require("../services/index");

const authCheck = async (req, res, next) => {
  const token = req?.cookies?._avt;
  if (!token) {
    return res.redirect("/login");
  }
  const authUser = commonService.verifyToken(token);
  try {
    if (!authUser) {
      return res.redirect("/login");
    }
    req.authUser = authUser;
    await authUser.then((authArray) => {
      req.auth = authArray;
    });
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({
      status: false,
      message: "No token provided or invalid token format.",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(400).send({ status: false, message: "Token Required." });
  }
  const authUser = commonService.verifyToken(token);
  if (!authUser) {
    res.status(400).send({ status: false, message: "Token not valid." });
  }
  await authUser.then((authArray) => {
    req.auth = authArray;
  });
  next();
};

module.exports = { authCheck, verifyToken };
