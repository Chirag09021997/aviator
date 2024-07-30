const { settings: SettingModel, gameStrategy: GameStrategyModel } = require("../models/index");
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

module.exports = { settingSeed, gameStrategySeed };