const { methods: commonService } = require('../services/index');
const { renderPage, cmDeleteRecord } = require("./commonController");
const { betting: BettingModel, bettingUser: BettingUserModel, sequelize } = require('../models');

const index = async (req, res) => {
    const getData = await commonService.getAll(BettingModel, {
        order: [['created_at', 'DESC']],
    });
    renderPage(req, res, "betting/index", {
        title: "Betting",
        activePage: "betting",
        getData: getData,
    });
};

const getData = async (req, res) => {
    const draw = req?.query?.draw;
    const start = parseInt(req?.query?.start);
    const length = parseInt(req?.query?.length);

    try {
        // Fetch betting records with aggregation
        const data = await sequelize.query(
            `SELECT  betting.id, betting.amount, betting.out_amount,  betting.t_users, betting.game_strategy_id, betting.result, betting.status, betting.created_at, COALESCE(SUM(betting_users.amount), 0) AS total_amount, COALESCE(SUM(betting_users.out_amount), 0) AS total_out_amount,COUNT(betting_users.id) AS total_users FROM bettings AS betting LEFT JOIN betting_users AS betting_users ON betting.id = betting_users.betting_id GROUP BY betting.id ORDER BY betting.created_at DESC LIMIT :start, :length`,
            {
                replacements: { start: start, length: length },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Count total records
        const totalRecords = await sequelize.query(
            `SELECT COUNT(*) AS count FROM bettings`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const response = {
            draw: draw,
            recordsTotal: totalRecords[0].count,
            recordsFiltered: totalRecords[0].count,
            data: data
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).render("error", { error: "Internal Server Error" });
    }
};


const crashBetting = async (req, res) => {
    console.log("Create Batting called =>", req.body);
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).render("error", { error: "Bad Request" });
    }
    try {
        const dataCheck = await commonService.get(BettingModel, { where: { id, status: true } });
        if (!dataCheck) {
            return res.status(404).send({
                success: false,
                message: `Cannot find id=${id}.`,
            });
        }
        const deleteData = await commonService.update(BettingModel, { where: { id } }, {
            status: false
        });
        if (deleteData) {
            res.status(200).send({ success: true });
        } else {
            res.status(404).send({
                success: false,
                message: `Cannot Delete Data`,
            });
        }
    } catch (error) {
        console.error("cmDeleteRecord=>", error.message);
        res.status(500).render("error", { error: "Internal Server Error" });
    }
};

module.exports = { index, getData, crashBetting };