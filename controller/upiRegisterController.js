const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { upiRegisters: UpiRegistersModel } = require('../models');
const { upiRegister: UpiRegisterValidate } = require('../validate/index');
const fs = require('fs');
const path = require('path');

const index = async (req, res) => {
    const getData = await commonService.getAll(UpiRegistersModel, { attributes: ["id", "upi_id", "barcode_photo", "status"] });
    renderPage(req, res, "upiRegisters/index", {
        title: "UPI Register",
        activePage: "upiRegisters",
        getData: getData,
    });
};

const create = async (req, res) => {
    renderPage(req, res, "upiRegisters/create", {
        title: "UPI Register",
        activePage: "upiRegisters",
    });
};

const store = async (req, res) => {
    const { upi_id } = req.body;
    const barcode_photo = req?.file?.filename;
    const { error } = UpiRegisterValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        if (barcode_photo != null) {
            fs.unlink(`./public/images/${barcode_photo}`, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                }
            });
        }
        return renderPage(req, res, "upiRegisters/create", {
            title: "UPI Register",
            activePage: "upiRegisters",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    try {
        await commonService.create(UpiRegistersModel, { upi_id, barcode_photo });
        res.redirect("/upi-register");
    } catch (error) {
        console.error("upiRegisters store Error =>", error);
        renderPage(req, res, "upiRegisters/create", {
            title: "UPI Register",
            activePage: "upiRegisters",
            errorMsg: error,
            formData: req.body
        });
    }
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(UpiRegistersModel, { where: { id }, attributes: ["id", "upi_id", "barcode_photo", "status"] });
        if (detail) {
            renderPage(req, res, "upiRegisters/show", {
                title: "UPI Register",
                activePage: "upiRegisters",
                formData: detail
            });
        } else {
            res.redirect("/upi-register");
        }
    } catch (error) {
        res.redirect("/upi-register");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(UpiRegistersModel, { where: { id }, attributes: ["id", "upi_id", "barcode_photo", "status"] });
        if (detail) {
            renderPage(req, res, "upiRegisters/edit", {
                title: "UPI Register",
                activePage: "upiRegisters",
                formData: detail
            });
        } else {
            res.redirect("/upi-register");
        }
    } catch (error) {
        res.redirect("/upi-register");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { upi_id } = req.body;
        const barcode_photo = req?.file?.filename;
        const { error } = UpiRegisterValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            if (barcode_photo != null) {
                fs.unlink(`./public/images/${barcode_photo}`, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    }
                });
            }
            return renderPage(req, res, "upiRegisters/edit", {
                title: "UPI Register",
                activePage: "upiRegisters",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        const detail = await commonService.get(UpiRegistersModel, { where: { id } });
        let obj = {
            upi_id
        };
        if (barcode_photo) {
            if (detail.barcode_photo != null) {
                fs.unlink(`./public/images/${detail.barcode_photo}`, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    }
                });
            }
            obj.barcode_photo = barcode_photo;
        }

        if (detail) {
            try {
                const update = await commonService.update(UpiRegistersModel, {
                    where: { id }
                }, obj);
                if (update) {
                    res.redirect("/upi-register");
                } else {
                    renderPage(req, res, "upiRegisters/edit", {
                        title: "UPI Register",
                        activePage: "upiRegisters",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("upiRegisters update =>", error);
                renderPage(req, res, "upiRegisters/edit", {
                    title: "UPI Register",
                    activePage: "upiRegisters",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/upi-register");
        }
    } else {
        res.redirect("/upi-register");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, UpiRegistersModel);
};

const changeStatus = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const oldDetail = await commonService.get(UpiRegistersModel, {
            where: { id },
            attributes: ["status"],
        });
        let status;
        if (oldDetail.status == "Active") {
            status = "Inactive";
        } else {
            status = "Active";
        }
        try {
            const detail = await commonService.update(
                UpiRegistersModel,
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