const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { payments: PaymentsModel } = require('../models');
const { paymentsDeposit: PaymentDepositValidate } = require('../validate/index');
const fs = require('fs');
const path = require('path');

const index = async (req, res) => {
    const getData = await commonService.getAll(PaymentsModel, {
        attributes: ["id", "mobile_no", "upi_id", "amount", "photo", "transaction_no", "status"],
        where: {
            pay_type: "Deposit"
        }
    });
    //     type: DataTypes.ENUM("Withdraw", "Deposit"),
    renderPage(req, res, "paymentDeposit/index", {
        title: "Payments Deposit",
        activePage: "paymentDeposit",
        getData: getData,
    });
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(PaymentsModel, { where: { id, pay_type: "Deposit" }, attributes: ["id", "mobile_no", "upi_id", "amount", "photo", "transaction_no", "status", "note"] });
        if (detail) {
            renderPage(req, res, "paymentDeposit/show", {
                title: "Payments Deposit",
                activePage: "paymentDeposit",
                formData: detail
            });
        } else {
            res.redirect("/payment-deposit");
        }
    } catch (error) {
        res.redirect("/payment-deposit");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(PaymentsModel, { where: { id, pay_type: "Deposit" }, attributes: ["id", "mobile_no", "upi_id", "amount", "photo", "transaction_no", "status", "note"] });
        if (detail) {
            renderPage(req, res, "paymentDeposit/edit", {
                title: "Payments Deposit",
                activePage: "paymentDeposit",
                formData: detail
            });
        } else {
            res.redirect("/payment-deposit");
        }
    } catch (error) {
        res.redirect("/payment-deposit");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { mobile_no, upi_id, amount, transaction_no, status, note } = req.body;
        const photo = req?.file?.filename;
        const { error } = PaymentDepositValidate.validate(req.body, {
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
            return renderPage(req, res, "paymentDeposit/edit", {
                title: "Payments Deposit",
                activePage: "paymentDeposit",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        const detail = await commonService.get(PaymentsModel, { where: { id, pay_type: "Deposit" } });
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
                    where: { id, pay_type: "Deposit" }
                }, obj);
                if (update) {
                    res.redirect("/payment-deposit");
                } else {
                    renderPage(req, res, "paymentDeposit/edit", {
                        title: "Payments Deposit",
                        activePage: "paymentDeposit",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("paymentDeposit update =>", error);
                renderPage(req, res, "paymentDeposit/edit", {
                    title: "Payments Deposit",
                    activePage: "paymentDeposit",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/payment-deposit");
        }
    } else {
        res.redirect("/payment-deposit");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, PaymentsModel);
};

module.exports = { index, show, edit, update, deleteRecord };