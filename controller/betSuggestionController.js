const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { betSuggestPlans: BetSuggestionModel } = require('../models');
const { betSuggestion: BetSuggestionValidate } = require('../validate/index');

const index = async (req, res) => {
    const getData = await commonService.getAll(BetSuggestionModel, { attributes: ["id", "amount"] });
    renderPage(req, res, "betSuggestion/index", {
        title: "Bet Suggestion",
        activePage: "betSuggestion",
        getData: getData,
    });
};

const create = async (req, res) => {
    renderPage(req, res, "betSuggestion/create", {
        title: "Bet Suggestion",
        activePage: "betSuggestion",
    });
};

const store = async (req, res) => {
    const { amount } = req.body;
    const { error } = BetSuggestionValidate.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.reduce((acc, err) => {
            acc[err.context.key] = err.message;
            return acc;
        }, {});
        return renderPage(req, res, "betSuggestion/create", {
            title: "Bet Suggestion",
            activePage: "betSuggestion",
            errorMsg: "Validation Error.",
            formData: req.body,
            errors
        });
    }
    try {
        await commonService.create(BetSuggestionModel, { amount });
        res.redirect("/bet-suggestion");
    } catch (error) {
        console.error("betSuggestion store Error =>", error);
        renderPage(req, res, "betSuggestion/create", {
            title: "Bet Suggestion",
            activePage: "betSuggestion",
            errorMsg: error,
            formData: req.body
        });
    }
};

const show = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(BetSuggestionModel, { where: { id }, attributes: ["id", "amount"] });
        if (detail) {
            renderPage(req, res, "betSuggestion/show", {
                title: "Bet Suggestion",
                activePage: "betSuggestion",
                formData: detail
            });
        } else {
            res.redirect("/bet-suggestion");
        }
    } catch (error) {
        res.redirect("/bet-suggestion");
    }
};

const edit = async (req, res) => {
    const id = req?.params?.id;
    try {
        const detail = await commonService.get(BetSuggestionModel, { where: { id }, attributes: ["id", "amount"] });
        if (detail) {
            renderPage(req, res, "betSuggestion/edit", {
                title: "Bet Suggestion",
                activePage: "betSuggestion",
                formData: detail
            });
        } else {
            res.redirect("/bet-suggestion");
        }
    } catch (error) {
        res.redirect("/bet-suggestion");
    }
};

const update = async (req, res) => {
    const id = req?.params?.id;
    if (id) {
        const { amount } = req.body;
        const { error } = BetSuggestionValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return renderPage(req, res, "betSuggestion/edit", {
                title: "Bet Suggestion",
                activePage: "betSuggestion",
                errorMsg: "Validation Error.",
                formData: req.body,
                errors
            });
        }

        const detail = await commonService.get(BetSuggestionModel, { where: { id } });
        if (detail) {
            try {
                const update = await commonService.update(BetSuggestionModel, {
                    where: { id }
                }, {
                    amount
                });
                if (update) {
                    res.redirect("/bet-suggestion");
                } else {
                    renderPage(req, res, "betSuggestion/edit", {
                        title: "Bet Suggestion",
                        activePage: "betSuggestion",
                        formData: req.body
                    });
                }
            } catch (error) {
                console.error("betSuggestion update =>", error);
                renderPage(req, res, "betSuggestion/edit", {
                    title: "Bet Suggestion",
                    activePage: "betSuggestion",
                    formData: req.body,
                    errorMsg: error,
                });
            }
        } else {
            res.redirect("/bet-suggestion");
        }
    } else {
        res.redirect("/bet-suggestion");
    }
};

const deleteRecord = async (req, res) => {
    cmDeleteRecord(req, res, BetSuggestionModel);
};

module.exports = { index, create, store, show, edit, update, deleteRecord };