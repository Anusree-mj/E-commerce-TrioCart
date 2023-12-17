const cron =  require('node-cron');
 const collection = require('../models/index-model')

 async function markExpiredOTPs() {
    try {      
      const currentTime = new Date();  
   
      await collection.tempUsersCollection.updateMany(
        {
          otpExpiryTime: { $lt: currentTime },
          otpExpired: false,
        },
        {
          $set: { otpExpired: true },
        }
      );
  
      console.log('otp expired');
    } catch (error) {
      console.error('Error occured', error);     
    }
  }
  
  async function markExpiredOrders() {
    try {
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        const orders = await collection.orderCollection.find({ returnValid: true });

        const expiredOrders = orders.filter(order => {
            const orderDate = new Date(order.returnDate);
            const orderDateString = orderDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });

            return orderDateString < currentDate;
        });

        await Promise.all(expiredOrders.map(async (order) => {
            order.returnValid = false;
            await order.save();
        }));

        console.log('returnValidity updated');
    } catch (error) {
        console.log(error);
    }
}
function expireOTP(){
  cron.schedule('*/1 * * * *', markExpiredOTPs);
}
function scheduleCronJob() {   
  cron.schedule('0 0 * * *', markExpiredOrders);
}


  module.exports = { scheduleCronJob,expireOTP };