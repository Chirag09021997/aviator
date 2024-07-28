const { renderPage } = require('../controller/commonController');
const { users: UserModel, payments: PaymentsModel } = require("../models/index");
const dashboard = async (req, res) => {
    try {
        const [userCount, totalPaymentDeposit, totalPaymentWithdraw] = await Promise.all([
            UserModel.count(),
            PaymentsModel.sum('amount', { where: { pay_type: 'Deposit', status: "Complete" } }),
            PaymentsModel.sum('amount', { where: { pay_type: 'Withdraw', status: "Complete" } })
        ]);
        renderPage(req, res, 'dashboard', {
            title: 'Dashboard',
            activePage: "dashboard",
            detail: {
                userCount: userCount || 0,
                totalPaymentDeposit: totalPaymentDeposit || 0,
                totalPaymentWithdraw: totalPaymentWithdraw || 0
            }
        });
    } catch (error) {
        renderPage(req, res, 'dashboard', {
            title: 'Dashboard',
            activePage: "dashboard"
        });
    }
};
module.exports = { dashboard };