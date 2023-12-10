const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const dailySalesHelpers = require('../../helpers/admin/orders/sales/dailySales-helpers');
const yearlySalesHelpers = require('../../helpers/admin/orders/sales/yearlySales-helpers');
const weaklySalesHelpers = require('../../helpers/admin/orders/sales/weaklySales-helpers');

const getSalesPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    const getDay = req.query.day;
    const getYear = req.query.yearly;
    const getStartingWeak=req.query.startingWeak;
    const getEndingWeak=req.query.endingWeak;
    adminLoginHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {

            if (getDay) {
                const day = new Date(getDay)
                dailySalesHelpers.getSalesCountBasedOnDay(day).then(result => {
                    const { dailySales, totalSalesAmount } = result;
                    console.log('salesqq:::', dailySales, "totalEarning::", totalSalesAmount)

                    dailySalesHelpers.getSalesBasedOnDay(day).then(salesList => {
                        res.render('admin/sales', {
                            layout: 'layout/layout', dailySales,
                            totalEarnings: totalSalesAmount, salesList
                        });
                    })
                })
            }
            else
                if (getYear){
                   const year = new Date(getYear).getFullYear()
                    yearlySalesHelpers.getSalesCountBasedOnYear(year).then(result => {
                        const { dailySales, totalSalesAmount } = result;
                        console.log('salesqq:::', dailySales, "totalEarning::", totalSalesAmount)
    
                       yearlySalesHelpers.getSalesBasedOnYear(year).then(salesList => {
                            res.render('admin/sales', {
                                layout: 'layout/layout', dailySales,
                                totalEarnings: totalSalesAmount, salesList
                            });
                        })
                    }) 
                }
                else
                if(getStartingWeak && getEndingWeak){
                    const start = new Date(getStartingWeak);
                    const end = new Date(getEndingWeak);

                    weaklySalesHelpers.getSalesCountBasedOnWeak(start,end).then(result => {
                        const { dailySales, totalSalesAmount } = result;
                        console.log('salesqq:::', dailySales, "totalEarning::", totalSalesAmount)
    
                       weaklySalesHelpers.getSalesBasedOnWeak(start,end).then(salesList => {
                            res.render('admin/sales', {
                                layout: 'layout/layout', dailySales,
                                totalEarnings: totalSalesAmount, salesList
                            });
                        })
                    }) 
                }
                else{
                    const day = new Date()
                dailySalesHelpers.getSalesCountBasedOnDay(day).then(result => {
                    const { dailySales, totalSalesAmount } = result;
                    console.log('salesqq:::', dailySales, "totalEarning::", totalSalesAmount)

                    dailySalesHelpers.getSalesBasedOnDay(day).then(salesList => {
                        res.render('admin/sales', {
                            layout: 'layout/layout', dailySales,
                            totalEarnings: totalSalesAmount, salesList
                        });
                    })
                })
                }
        }
        else {
            res.redirect('/admin/login')
        }
    })
}



module.exports = {
    getSalesPage,
}