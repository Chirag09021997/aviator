const Joi = require('joi');

const usersRegister = Joi.object({
    mobile_no: Joi.string().required(),
    upi_id: Joi.string().optional().allow(""),
});

const paymentDeposit = Joi.object({
    mobile_no: Joi.string().required(),
    upi_id: Joi.string().required(),
    amount: Joi.number().integer().min(1).max(50000).required(),
    transaction_no: Joi.string().required(),
});

const paymentWithdraw = Joi.object({
    mobile_no: Joi.string().required(),
    upi_id: Joi.string().required(),
    amount: Joi.number().integer().min(1).max(50000).required(),
});

const wallet = Joi.object({
    mobile_no: Joi.string().required(),
});

const myBet = Joi.object({
    mobile_no: Joi.string().required(),
});

module.exports = { usersRegister, paymentDeposit, paymentWithdraw, wallet, myBet };