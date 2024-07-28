const { settings: SettingModel } = require("../models/index");
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

module.exports = { settingSeed };