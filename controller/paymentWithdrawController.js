const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { payments: PaymentsModel } = require('../models');
const { paymentsWithdraw: PaymentWithdrawValidate } = require('../validate/index');
const fs = require('fs');

const index = async (req, res) => {
    const getData = await commonService.getAll(PaymentsModel, {
        attributes: ["id", "mobile_no", "upi_id", "amount", "photo", "transaction_no", "status"],
        where: {
            pay_type: "Withdraw"
        }
    });
    renderPage(req, res, "paymentWithdraw/index", {
        title: "Payments Withdraw",
        activePage: "paymentWithdraw",
        getData: getData,
    });
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(PaymentsModel, { where: { id, pay_type: "Withdraw" }, attributes: ["id", "mobile_no", "upi_id", "amount", "photo", "transaction_no", "status", "note"] });
        if (detail) {
            renderPage(req, res, "paymentWithdraw/show", {
                title: "Payments Withdraw",
                activePage: "paymentWithdraw",
                formData: detail
            });
        } else {
            res.redirect("/payment-withdraw");
        }
    } catch (error) {
        res.redirect("/payment-withdraw");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(PaymentsModel, { where: { id, pay_type: "Withdraw" }, attributes: ["id", "mobile_no", "upi_id", "amount", "photo", "transaction_no", "status", "note"] });
        if (detail) {
            renderPage(req, res, "paymentWithdraw/edit", {
                title: "Payments Withdraw",
                activePage: "paymentWithdraw",
                formData: detail
            });
        } else {
            res.redirect("/payment-withdraw");
        }
    } catch (error) {
        res.redirect("/payment-withdraw");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { mobile_no, upi_id, amount, transaction_no, status, note } = req.body;
        const photo = req?.file?.filename;
        const { error } = PaymentWithdrawValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            if (photo != null) {
                fs.unlink(`./public/images/${photo}`, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    }
                });
            }
            return renderPage(req, res, "paymentWithdraw/edit", {
                title: "Payments Withdraw",
                activePage: "paymentWithdraw",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        const detail = await commonService.get(PaymentsModel, { where: { id, pay_type: "Withdraw" } });
        let obj = {
            mobile_no,
            upi_id,
            amount,
            transaction_no,
            note,
            status,
            photo: photo ? photo : detail?.photo
        };
        if (detail) {
            try {
                const update = await commonService.update(PaymentsModel, {
                    where: { id, pay_type: "Withdraw" }
                }, obj);
                if (update) {
                    res.redirect("/payment-withdraw");
                } else {
                    renderPage(req, res, "paymentWithdraw/edit", {
                        title: "Payments Withdraw",
                        activePage: "paymentWithdraw",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("paymentWithdraw update =>", error);
                renderPage(req, res, "paymentWithdraw/edit", {
                    title: "Payments Withdraw",
                    activePage: "paymentWithdraw",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/payment-withdraw");
        }
    } else {
        res.redirect("/payment-withdraw");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, PaymentsModel);
};

module.exports = { index, show, edit, update, deleteRecord };