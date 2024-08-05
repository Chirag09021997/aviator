const Joi = require('joi');

const registerValidate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .min(6),
    password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .label('Password Confirmation')
        .messages({ 'any.only': '{{#label}} does not match' }),
});

const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const betSuggestion = Joi.object({
    amount: Joi.number().integer().min(1).max(50000).required(),
});

const cashPlan = Joi.object({
    amount: Joi.number().integer().min(1).max(50000).required(),
    bonus_amount: Joi.number().min(0).max(10000).precision(2).required(),
});

const usersRegister = Joi.object({
    mobile_no: Joi.string().required(),
    upi_id: Joi.string().optional(),
    note: Joi.string().optional()
});

const upiRegister = Joi.object({
    upi_id: Joi.string().required(),
});

const paymentsDeposit = Joi.object({
    mobile_no: Joi.string().required(),
    upi_id: Joi.string().required(),
    amount: Joi.number().integer().min(1).max(50000).required(),
    status: Joi.string().valid('Pending', 'Rejected', 'Complete').required(),
    transaction_no: Joi.string().empty("").optional(),
    note: Joi.string().empty("").optional(),
});

const paymentsWithdraw = Joi.object({
    mobile_no: Joi.string().required(),
    upi_id: Joi.string().allow(""),
    amount: Joi.number().integer().min(1).max(50000).required(),
    status: Joi.string().valid('Pending', 'Rejected', 'Complete').required(),
    transaction_no: Joi.string().allow("").optional(),
    note: Joi.string().allow("").optional(),
});

const gameStrategy = Joi.object({
    game_option: Joi.number().min(1).max(300).precision(2).required(),
});

const setting = Joi.object({
    s_key: Joi.string().required(),
    s_value: Joi.number().min(0).max(50000).precision(2).required(),
});

module.exports = { registerValidate, loginValidate, betSuggestion, cashPlan, usersRegister, upiRegister, paymentsDeposit, paymentsWithdraw, gameStrategy, setting };