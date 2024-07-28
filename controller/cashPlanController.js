const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { cashPlans: CashPlanModel } = require('../models');
const { cashPlan: CashPlanValidate } = require('../validate/index');

const index = async (req, res) => {
    const getData = await commonService.getAll(CashPlanModel, { attributes: ["id", "amount", "bonus_amount"] });
    renderPage(req, res, "cashPlan/index", {
        title: "Cash Plan",
        activePage: "cashPlan",
        getData: getData,
    });
};

const create = async (req, res) => {
    renderPage(req, res, "cashPlan/create", {
        title: "Cash Plan",
        activePage: "cashPlan",
    });
};

const store = async (req, res) => {
    const { amount, bonus_amount } = req.body;
    const { error } = CashPlanValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        return renderPage(req, res, "cashPlan/create", {
            title: "Cash Plan",
            activePage: "cashPlan",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    try {
        await commonService.create(CashPlanModel, { amount, bonus_amount });
        res.redirect("/cash-plan");
    } catch (error) {
        console.error("cashPlan store Error =>", error);
        renderPage(req, res, "cashPlan/create", {
            title: "Cash Plan",
            activePage: "cashPlan",
            errorMsg: error,
            formData: req.body
        });
    }
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(CashPlanModel, { where: { id }, attributes: ["id", "amount", "bonus_amount"] });
        if (detail) {
            renderPage(req, res, "cashPlan/show", {
                title: "Cash Plan",
                activePage: "cashPlan",
                formData: detail
            });
        } else {
            res.redirect("/cash-plan");
        }
    } catch (error) {
        res.redirect("/cash-plan");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(CashPlanModel, { where: { id }, attributes: ["id", "amount", "bonus_amount"] });
        if (detail) {
            renderPage(req, res, "cashPlan/edit", {
                title: "Cash Plan",
                activePage: "cashPlan",
                formData: detail
            });
        } else {
            res.redirect("/cash-plan");
        }
    } catch (error) {
        res.redirect("/cash-plan");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { amount, bonus_amount } = req.body;
        const { error } = CashPlanValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return renderPage(req, res, "cashPlan/edit", {
                title: "Cash Plan",
                activePage: "cashPlan",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        const detail = await commonService.get(CashPlanModel, { where: { id } });
        if (detail) {
            try {
                const update = await commonService.update(CashPlanModel, {
                    where: { id }
                }, {
                    amount,
                    bonus_amount
                });
                if (update) {
                    res.redirect("/cash-plan");
                } else {
                    renderPage(req, res, "cashPlan/edit", {
                        title: "Cash Plan",
                        activePage: "cashPlan",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("cashPlan update =>", error);
                renderPage(req, res, "cashPlan/edit", {
                    title: "Cash Plan",
                    activePage: "cashPlan",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/cash-plan");
        }
    } else {
        res.redirect("/cash-plan");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, CashPlanModel);
};

module.exports = { index, create, store, show, edit, update, deleteRecord };