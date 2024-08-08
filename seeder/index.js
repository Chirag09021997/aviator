const { settings: SettingModel, gameStrategy: GameStrategyModel, cashPlans: CashPlanModel, betSuggestPlans: betSuggestPlansModel, upiRegisters: UpiRegistersModel } = require("../models/index");
const { createSlug } = require('../controller/commonController');
const settingSeed = async () => {
    try {
        const insertRecords = [
            {
                s_key: createSlug("amount time"),
                s_value: 50.5,
            },
            {
                s_key: createSlug("game time"),
                s_value: 100,
            }
        ];
        await SettingModel.bulkCreate(insertRecords);
    } catch (error) {
        console.error("settingSeed insert error=>", error);
    }
}

const gameStrategySeed = async () => {
    try {
        const insertRecords = [
            { game_option: 0.5 },
            { game_option: 1.0 },
            { game_option: 1.3 },
            { game_option: 1.6 },
            { game_option: 2.1 },
            { game_option: 2.6 },
            { game_option: 3 },
            { game_option: 1.3 },
        ];
        await GameStrategyModel.bulkCreate(insertRecords);
    } catch (error) {
        console.error("gameStrategySeed insert error=>", error);
    }
};

const cashPlanSeed = async () => {
    try {
        const insertRecords = [
            { amount: 5, bonus_amount: 0 },
            { amount: 10, bonus_amount: 0 },
            { amount: 20, bonus_amount: 0 },
            { amount: 40, bonus_amount: 0 },
            { amount: 80, bonus_amount: 0 },
            { amount: 100, bonus_amount: 5 },
            { amount: 200, bonus_amount: 10 },
            { amount: 400, bonus_amount: 20 },
            { amount: 1000, bonus_amount: 50 },
        ];
        await CashPlanModel.bulkCreate(insertRecords);
    } catch (error) {
        console.error("cashPlanSeed insert error=>", error);
    }
}

const betSuggestPlansSeed = async () => {
    try {
        const insertRecords = [
            { amount: 11 },
            { amount: 20 },
            { amount: 40 },
            { amount: 80 },
            { amount: 300 },
            { amount: 5000 },
        ];
        await betSuggestPlansModel.bulkCreate(insertRecords);
    } catch (error) {
        console.error("betSuggestPlansSeed insert error=>", error);
    }
}

const UpiRegisterSeed = async () => {
    try {
        const insertRecords = [
            { upi_id: "djpatel1396@ybl", barcode_photo: "1723038027057WhatsAppImage2024-08-07at7.10.06PM.jpeg" },
        ];
        await UpiRegistersModel.bulkCreate(insertRecords);
    } catch (error) {
        console.error("UpiRegisterSeed insert error=>", error);
    }
}

module.exports = { settingSeed, gameStrategySeed, cashPlanSeed, betSuggestPlansSeed, UpiRegisterSeed };