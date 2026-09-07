const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(userId);

        // Total Income
        const totalIncomeResult = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Total Expense
        const totalExpenseResult = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = totalIncomeResult[0]?.total || 0;
        const totalExpense = totalExpenseResult[0]?.total || 0;
        const totalBalance = totalIncome - totalExpense;

        // Last 60 days Income
        const last60DaysIncomeTransactions = await Income.find({
            userId:userObjectId,
            date: {
                $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + Number(transaction.amount),
            0
        );

        // Last 30 days Expense
        const last30DaysExpenseTransactions = await Expense.find({
            userId:userObjectId,
            date: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        }).sort({ date: -1 });

        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + Number(transaction.amount),
            0
        );

        // Recent Income
        const recentIncome = await Income.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        // Recent Expense
        const recentExpense = await Expense.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        // Merge and sort transactions
        const recentTransactions = [
            ...recentIncome.map((txn) => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...recentExpense.map((txn) => ({
                ...txn.toObject(),
                type: "expense",
            })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            totalBalance,
            totalIncome,
            totalExpense,
            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions,
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};