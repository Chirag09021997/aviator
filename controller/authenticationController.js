const { renderPage } = require("./commonController");
const { methods: commonService } = require('../services/index');
const { admins: AdminModel } = require('../models');
const { registerValidate, loginValidate } = require('../validate/index');

const getRegister = async (req, res) => {
    renderPage(req, res, "register", {
        title: "Register",
    });
};

const register = async (req, res) => {
    const { name, email, password } = req?.body;
    const { error } = registerValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        renderPage(req, res, "register", {
            title: "Register",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    const hashPassword = await commonService.generateHashPassword(password, 8);
    let obj = {
        name,
        email,
        password: hashPassword,
    };

    try {
        const adminDetail = await commonService.get(AdminModel, {
            where: { email: email },
        });
        if (!adminDetail) {
            const admin = await commonService.create(AdminModel, obj);
            if (admin) {
                res.redirect("/login");
            } else {
                renderPage(req, res, "register", {
                    title: "Register",
                    errorMsg: "Something went wrong.",
                    formData: req.body,
                })
            }
        } else {
            renderPage(req, res, "register", {
                title: "Register",
                errorMsg: "Email already exists.",
                formData: req.body,
            });
        }
    } catch (error) {
        console.error("Register =>", error);
        renderPage(req, res, "register", {
            title: "Register",
            formData: req.body,
            errorMsg: error?.message,
        });
    }
};

const getLogin = async (req, res) => {
    renderPage(req, res, "login", {
        title: "Login",
    });
};

const login = async (req, res) => {
    const { email, password: pwd } = req?.body;
    const { error } = loginValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const firstError = error.details[0]?.message || "Validation Error.";
        renderPage(req, res, "login", {
            title: "Login",
            errorMsg: firstError,
        });
    }

    let query = {
        where: { email },
        attributes: ["id", "name", "email", "password", "profile"],
    };

    const userDetail = await commonService.get(AdminModel, query);
    if (userDetail) {
        let passwordValidate = await commonService.passwordCompare(
            pwd,
            userDetail.password
        );
        const token = await commonService.generateToken(userDetail);
        if (passwordValidate) {
            res.cookie("_avt", token);
            res.redirect("/dashboard");
        } else {
            renderPage(req, res, "login", {
                title: "Login",
                errorMsg: "Credential not valid.",
            });
        }
    } else {
        renderPage(req, res, "login", {
            title: "Login",
            errorMsg: "Credential not valid.",
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("_avt");
    res.redirect("/login");
};

module.exports = { getRegister, register, getLogin, login, logout };