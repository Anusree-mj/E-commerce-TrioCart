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
  
  function scheduleCronJob() {   
    cron.schedule('*/2 * * * *', markExpiredOTPs);
  }
  
  module.exports = { scheduleCronJob };