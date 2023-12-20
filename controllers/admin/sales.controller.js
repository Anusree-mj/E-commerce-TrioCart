const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const dailySalesHelpers = require('../../helpers/admin/orders/sales/dailySales-helpers');
const yearlySalesHelpers = require('../../helpers/admin/orders/sales/yearlySales-helpers');
const weaklySalesHelpers = require('../../helpers/admin/orders/sales/weaklySales-helpers');

const getSalesPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        const getDay = req.query.day;
        const getYear = req.query.yearly;
        const getStartingWeak = req.query.startingWeak;
        const getEndingWeak = req.query.endingWeak;

        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let day, year, start, end;

            if (getDay) {
                day = new Date(getDay);
            } else if (getYear) {
                year = new Date(getYear).getFullYear();
            } else if (getStartingWeak && getEndingWeak) {
                start = new Date(getStartingWeak);
                end = new Date(getEndingWeak);
            } else {
                day = new Date();
            }

            let salesCount, totalSalesAmount, salesList;

            if (day) {
                ({ dailySales: salesCount, totalSalesAmount } = await dailySalesHelpers.getSalesCountBasedOnDay(day));
                salesList = await dailySalesHelpers.getSalesBasedOnDay(day);
            } else if (year) {
                ({ dailySales: salesCount, totalSalesAmount } = await yearlySalesHelpers.getSalesCountBasedOnYear(year));
                salesList = await yearlySalesHelpers.getSalesBasedOnYear(year);
            } else if (start && end) {
                ({ dailySales: salesCount, totalSalesAmount } = await weaklySalesHelpers.getSalesCountBasedOnWeak(start, end));
                salesList = await weaklySalesHelpers.getSalesBasedOnWeak(start, end);
            }

            res.render('admin/adminSales/sales', {
                layout: 'layout/layout', dailySales: salesCount,
                totalEarnings: totalSalesAmount, salesList
            });
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        // Handle errors here
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports = {
    getSalesPage,
}