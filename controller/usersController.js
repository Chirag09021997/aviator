const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { users: UsersModel } = require('../models');
const { usersRegister: UserRegisterValidate } = require('../validate/index');

const index = async (req, res) => {
    const getData = await commonService.getAll(UsersModel, { attributes: ["id", "mobile_no", "upi_id", "total_balance", "total_deposit", "total_withdraw", "total_bet", "status"] });
    renderPage(req, res, "users/index", {
        title: "Users",
        activePage: "users",
        getData: getData,
    });
};

const create = async (req, res) => {
    renderPage(req, res, "users/create", {
        title: "Users",
        activePage: "users",
    });
};

const store = async (req, res) => {
    const { mobile_no, upi_id, total_balance, total_deposit, total_withdraw, total_bet, note } = req.body;
    const { error } = UserRegisterValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        return renderPage(req, res, "users/create", {
            title: "Users",
            activePage: "users",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    try {
        await commonService.create(UsersModel, { mobile_no, upi_id, total_balance, total_deposit, total_withdraw, total_bet, note });
        res.redirect("/users");
    } catch (error) {
        console.error("Users store Error =>", error);
        renderPage(req, res, "users/create", {
            title: "Users",
            activePage: "users",
            errorMsg: error,
            formData: req.body
        });
    }
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(UsersModel, { where: { id }, attributes: ["id", "mobile_no", "upi_id", "total_balance", "total_deposit", "total_withdraw", "total_bet", "note", "status"] });
        if (detail) {
            renderPage(req, res, "users/show", {
                title: "Users",
                activePage: "users",
                formData: detail
            });
        } else {
            res.redirect("/users");
        }
    } catch (error) {
        res.redirect("/users");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(UsersModel, { where: { id }, attributes: ["id", "mobile_no", "upi_id", "total_balance", "total_deposit", "total_withdraw", "total_bet", "note", "status"] });
        if (detail) {
            renderPage(req, res, "users/edit", {
                title: "Users",
                activePage: "users",
                formData: detail
            });
        } else {
            res.redirect("/users");
        }
    } catch (error) {
        res.redirect("/users");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { mobile_no, upi_id, total_balance, total_deposit, total_withdraw, total_bet, note } = req.body;
        const { error } = UserRegisterValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return renderPage(req, res, "users/edit", {
                title: "Users",
                activePage: "users",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        const detail = await commonService.get(UsersModel, { where: { id } });
        if (detail) {
            try {
                const update = await commonService.update(UsersModel, {
                    where: { id }
                }, {
                    mobile_no, upi_id, total_balance, total_deposit, total_withdraw, total_bet, note
                });
                if (update) {
                    res.redirect("/users");
                } else {
                    renderPage(req, res, "users/edit", {
                        title: "Users",
                        activePage: "users",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("Users update =>", error);
                renderPage(req, res, "users/edit", {
                    title: "Users",
                    activePage: "users",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/users");
        }
    } else {
        res.redirect("/users");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, UsersModel);
};

const changeStatus = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const oldDetail = await commonService.get(UsersModel, {
            where: { id },
            attributes: ["status"],
        });
        let status;
        if (oldDetail.status == "Block") {
            status = "Unblock";
        } else {
            status = "Block";
        }
        try {
            const detail = await commonService.update(
                UsersModel,
                { where: { id } },
                { status }
            );
            if (detail) {
                res.send({ success: true });
            } else {
                res.status(500).render("error", { error: "Internal Server Error" });
            }
        } catch (error) {
            res.status(500).render("error", { error: "Internal Server Error" });
        }
    } else {
        res.status(500).render("error", { error: "Internal Server Error" });
    }
};

module.exports = { index, create, store, show, edit, update, deleteRecord, changeStatus };