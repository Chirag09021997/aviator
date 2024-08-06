const cron = require('node-cron');
const { betting: BettingModel, gameStrategy: GameStrategyModel } = require('../models/index');
const { methods: commonService } = require('../services/index');

const getRandomFloat = () => {
    const randomInt = Math.floor(Math.random() * 50);
    const randomFloat = randomInt / 10;
    return randomFloat;
}

const autoBettingCreate = async () => {
    await commonService.create(BettingModel, {
        result: getRandomFloat(),
    });
};

const strategyBettingCreate = async (gameStrategyId = null) => {
    let nextGameStrategy;
    // console.log("gameStrategyId=================>", gameStrategyId);
    if (gameStrategyId !== null) {
        nextGameStrategy = await commonService.get(GameStrategyModel, {
            where: {
                id: gameStrategyId + 1
            }
        });
    }
    // console.log("nextGameStrategy=>", nextGameStrategy);
    if (!nextGameStrategy) {
        // console.log("nextGameStrategy called status ");
        nextGameStrategy = await commonService.get(GameStrategyModel, {
            order: [['id', 'ASC']]
        });
    }
    // console.log("nextGameStrategy values=>", nextGameStrategy);
    const { id, game_option } = nextGameStrategy;
    // console.log(`nextGameStrategy => id::${id}, game_option :: ${game_option}`);
    await commonService.create(BettingModel, {
        result: game_option,
        game_strategy_id: id,
    });
};

const PendingTime = Number(process.env.GAME_PENDING_TIME) || 5;

cron.schedule('* * * * * *', async () => {
    // console.log(`cron job testing... Time ::  ${Date()}`);
    try {
        const lastBetRecord = await commonService.get(BettingModel, {
            attributes: ["id", "game_strategy_id", "result", "status", "created_at"],
            order: [['created_at', 'DESC']],
        })
        if (lastBetRecord) {
            const { id, game_strategy_id, result, status, created_at } = lastBetRecord;
            const newGameTime = new Date(created_at);
            const currentDateTime = new Date();
            newGameTime.setSeconds(newGameTime.getSeconds() + ((result * 5) + PendingTime));
            // const differenceInSeconds = Math.floor((currentDateTime - newGameTime) / 1000);
            // console.log("newGameTime=>", newGameTime);
            // console.log("currentDateTime=>", currentDateTime);
            // console.log("differenceInSeconds=>", differenceInSeconds);
            if (status) {
                if (newGameTime < currentDateTime) {
                    // console.log(`true true  true ::newGameTime=>${newGameTime} :: currentDateTime => ${currentDateTime}`);
                    await commonService.update(BettingModel, { where: { id } }, { status: false });
                    strategyBettingCreate(game_strategy_id);
                }
            } else {
                strategyBettingCreate(game_strategy_id);
            }

            // console.log("lastBetting record :: game_strategy_id=>", game_strategy_id);
            // console.log("lastBetting record :: result=>", result);
            // console.log("lastBetting record :: status=>", status);

        } else {
            autoBettingCreate();
        }

    } catch (error) {
        console.error("CronJob Issue =>", error);
    }
}); 