const { methods: commonService } = require("../../services/index");
const { payments: PaymentsModel, users: UserRegisterModel, bettingUser: BettingUserModel, cashPlans: CashPlanModel, betSuggestPlans: betSuggestPlansModel } = require('../../models/index');
const { usersRegister: UserRegisterValidate, paymentDeposit: PaymentDepositValidate, paymentWithdraw: PaymentWithdrawValidate, wallet: WalletValidate, myBet: MyBetValidate } = require("../../validate/api");

const UserRegister = async (req, res) => {
    const { mobile_no, upi_id } = req.body;
    try {
        const { error } = UserRegisterValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ status: false, message: "Validation Errors.", errors });
        }

        const cashPlanDetails = await commonService.getAll(CashPlanModel, {
            attributes: ["amount", "bonus_amount"]
        });

        const betSuggestPlansDetails = await commonService.getAll(betSuggestPlansModel, {
            attributes: ["amount"]
        });

        const userDetail = await commonService.get(UserRegisterModel, { where: { mobile_no } });
        if (userDetail) {
            return res.status(404).json({
                status: false,
                message: "User all ready registered.",
                data: userDetail,
                cashPlan: cashPlanDetails,
                betSuggestPlans: betSuggestPlansDetails
            });
        }
        const user = await commonService.create(UserRegisterModel, { mobile_no, upi_id });
        return res.status(201).json({
            status: true,
            message: "User created successfully.",
            data: user,
            cashPlan: cashPlanDetails,
            betSuggestPlans: betSuggestPlansDetails
        });
    } catch (error) {
        console.log("UserRegister Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
}

const paymentDeposit = async (req, res) => {
    const { mobile_no, upi_id, transaction_no, amount } = req.body;
    try {
        const { error } = PaymentDepositValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ status: false, message: "Validation Errors.", errors });
        }

        // Check if the photo is uploaded
        if (!req.file) {
            return res.status(400).json({ status: false, message: "Photo is required." });
        }

        // Check if the user is registered
        const user = await commonService.get(UserRegisterModel, { where: { mobile_no } });
        if (!user) {
            return res.status(400).json({ status: false, message: "User not registered. Please register first." });
        }

        const paymentDetail = await commonService.create(PaymentsModel, {
            mobile_no, upi_id, transaction_no, amount, photo: req.file.filename, pay_type: "Deposit"
        });

        return res.status(201).json({
            status: true,
            message: "Payment Deposit Request send successFully.",
            data: paymentDetail
        });
    } catch (error) {
        console.log("paymentDeposit Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const paymentWithdraw = async (req, res) => {
    const { mobile_no, upi_id, amount } = req.body;
    console.log("payment Withdraw =>", req.body);
    try {
        const { error } = PaymentWithdrawValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ status: false, message: "Validation Errors.", errors });
        }

        // Check if the user is registered
        const user = await commonService.get(UserRegisterModel, { where: { mobile_no } });
        if (!user) {
            return res.status(400).json({ status: false, message: "User not registered. Please register first." });
        }

        const details = await commonService.create(PaymentsModel, {
            mobile_no, upi_id, amount, pay_type: "Withdraw"
        });

        return res.status(201).json({
            status: true,
            message: "Payment withdraw request send successFully.",
            data: details
        });
    } catch (error) {
        console.log("paymentWithdraw Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const walletList = async (req, res) => {
    const { mobile_no } = req.body;
    try {
        const { error } = WalletValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ status: false, message: "Validation Errors.", errors });
        }

        // Check if the user is registered
        const user = await commonService.get(UserRegisterModel, { where: { mobile_no } });
        if (!user) {
            return res.status(400).json({ status: false, message: "User not registered. Please register first." });
        }

        const details = await commonService.getAll(PaymentsModel, {
            attributes: ["amount", "status", "transaction_no", "pay_type", "note", "created_at"],
            where: { mobile_no },
        });

        return res.status(201).json({
            status: true,
            message: "Get wallet all records successFully.",
            data: details
        });
    } catch (error) {
        console.log("walletList Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const myBet = async (req, res) => {
    const { mobile_no } = req.body;
    try {
        const { error } = MyBetValidate.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.reduce((acc, err) => {
                acc[err.context.key] = err.message;
                return acc;
            }, {});
            return res.status(400).json({ status: false, message: "Validation Errors.", errors });
        }

        // Check if the user is registered
        const user = await commonService.get(UserRegisterModel, { where: { mobile_no } });
        if (!user) {
            return res.status(400).json({ status: false, message: "User not registered. Please register first." });
        }

        const details = await commonService.getAll(BettingUserModel, {
            attributes: ["betting_id", "amount", "out_amount", "created_at"],
            where: { user_id: user.id },
        });

        return res.status(200).json({
            status: true,
            message: "Get all bet records successFully.",
            data: details
        });
    } catch (error) {
        console.log("myBet Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const cashPlans = async (req, res) => {
    try {
        const details = await commonService.getAll(CashPlanModel, {
            attributes: ["amount", "bonus_amount"]
        });
        return res.status(200).json({
            status: true,
            message: "Get all cash plan records successFully.",
            data: details
        });
    } catch (error) {
        console.log("cashPlans Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const betSuggestPlans = async (req, res) => {
    try {
        const details = await commonService.getAll(betSuggestPlansModel, {
            attributes: ["amount"]
        });
        return res.status(200).json({
            status: true,
            message: "Get all bet suggest plans records successFully.",
            data: details
        });
    } catch (error) {
        console.log("betSuggestPlans Error => ", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { UserRegister, paymentDeposit, paymentWithdraw, walletList, myBet, cashPlans, betSuggestPlans };