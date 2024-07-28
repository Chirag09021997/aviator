const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord, createSlug } = require("./commonController");
const { settings: SettingModel } = require('../models');
const { setting: SettingsValidate } = require('../validate/index');

const index = async (req, res) => {
    const getData = await commonService.getAll(SettingModel, { attributes: ["id", "s_key", "s_value"] });
    renderPage(req, res, "settings/index", {
        title: "Settings",
        activePage: "settings",
        getData: getData,
    });
};

const create = async (req, res) => {
    renderPage(req, res, "settings/create", {
        title: "Settings",
        activePage: "settings",
    });
};

const store = async (req, res) => {
    let { s_key, s_value } = req.body;
    const { error } = SettingsValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        return renderPage(req, res, "settings/create", {
            title: "Settings",
            activePage: "settings",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    s_key = createSlug(s_key);
    try {
        await commonService.create(SettingModel, { s_key, s_value });
        res.redirect("/settings");
    } catch (error) {
        console.error("settings store Error =>", error);
        renderPage(req, res, "settings/create", {
            title: "Settings",
            activePage: "settings",
            errorMsg: error,
            formData: req.body
        });
    }
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(SettingModel, { where: { id }, attributes: ["id", "s_key", "s_value"] });
        if (detail) {
            renderPage(req, res, "settings/show", {
                title: "Settings",
                activePage: "settings",
                formData: detail
            });
        } else {
            res.redirect("/settings");
        }
    } catch (error) {
        res.redirect("/settings");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(SettingModel, { where: { id }, attributes: ["id", "s_key", "s_value"] });
        if (detail) {
            renderPage(req, res, "settings/edit", {
                title: "Settings",
                activePage: "settings",
                formData: detail
            });
        } else {
            res.redirect("/settings");
        }
    } catch (error) {
        res.redirect("/settings");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        let { s_key, s_value } = req.body;
        const { error } = SettingsValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return renderPage(req, res, "settings/edit", {
                title: "Settings",
                activePage: "settings",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        s_key = createSlug(s_key);
        const detail = await commonService.get(SettingModel, { where: { id } });
        if (detail) {
            try {
                const update = await commonService.update(SettingModel, {
                    where: { id }
                }, {
                    s_key, s_value
                });
                if (update) {
                    res.redirect("/settings");
                } else {
                    renderPage(req, res, "settings/edit", {
                        title: "Settings",
                        activePage: "settings",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("Settings update =>", error);
                renderPage(req, res, "settings/edit", {
                    title: "Settings",
                    activePage: "settings",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/settings");
        }
    } else {
        res.redirect("/settings");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, SettingModel);
};

module.exports = { index, create, store, show, edit, update, deleteRecord };