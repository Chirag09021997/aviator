const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { gameStrategy: GameStrategyModel } = require('../models');
const { gameStrategy: GameStrategyValidate } = require('../validate/index');

const index = async (req, res) => {
    const getData = await commonService.getAll(GameStrategyModel, { attributes: ["id", "game_option", "position"] });
    renderPage(req, res, "gameStrategy/index", {
        title: "Game Strategy",
        activePage: "gameStrategy",
        getData: getData,
    });
};

const create = async (req, res) => {
    renderPage(req, res, "gameStrategy/create", {
        title: "Game Strategy",
        activePage: "gameStrategy",
    });
};

const store = async (req, res) => {
    const { game_option, position } = req.body;
    const { error } = GameStrategyValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        return renderPage(req, res, "gameStrategy/create", {
            title: "Game Strategy",
            activePage: "gameStrategy",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    try {
        await commonService.create(GameStrategyModel, { game_option, position });
        res.redirect("/game-strategy");
    } catch (error) {
        console.error("gameStrategy store Error =>", error);
        renderPage(req, res, "gameStrategy/create", {
            title: "Game Strategy",
            activePage: "gameStrategy",
            errorMsg: error,
            formData: req.body
        });
    }
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(GameStrategyModel, { where: { id }, attributes: ["id", "game_option", "position"] });
        if (detail) {
            renderPage(req, res, "gameStrategy/show", {
                title: "Game Strategy",
                activePage: "gameStrategy",
                formData: detail
            });
        } else {
            res.redirect("/game-strategy");
        }
    } catch (error) {
        res.redirect("/game-strategy");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(GameStrategyModel, { where: { id }, attributes: ["id", "game_option", "position"] });
        if (detail) {
            renderPage(req, res, "gameStrategy/edit", {
                title: "Game Strategy",
                activePage: "gameStrategy",
                formData: detail
            });
        } else {
            res.redirect("/game-strategy");
        }
    } catch (error) {
        res.redirect("/game-strategy");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { game_option, position } = req.body;
        const { error } = GameStrategyValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return renderPage(req, res, "gameStrategy/edit", {
                title: "Game Strategy",
                activePage: "gameStrategy",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }
        const detail = await commonService.get(GameStrategyModel, { where: { id } });
        if (detail) {
            try {
                const update = await commonService.update(GameStrategyModel, {
                    where: { id }
                }, {
                    game_option,
                    position
                });
                if (update) {
                    res.redirect("/game-strategy");
                } else {
                    renderPage(req, res, "gameStrategy/edit", {
                        title: "Game Strategy",
                        activePage: "gameStrategy",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("gameStrategy update =>", error);
                renderPage(req, res, "gameStrategy/edit", {
                    title: "Game Strategy",
                    activePage: "gameStrategy",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/game-strategy");
        }
    } else {
        res.redirect("/game-strategy");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, GameStrategyModel);
};

module.exports = { index, create, store, show, edit, update, deleteRecord };