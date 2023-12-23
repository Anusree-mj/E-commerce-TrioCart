const cron = require('node-cron');
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

    for (const order of expiredOrders) {
      order.returnValid = false;
      await order.save();
    }

    console.log('returnValidity updated');
  } catch (error) {
    console.log(error);
  }
}

async function markExpiredCoupons() {
  try {
    const currentDate = new Date();

    const expiredCoupons = await collection.couponCollection.find({
      couponActivatingDate: { $lte: currentDate },
      couponDeactivatingDate: { $gt: currentDate },
      isValid: true,
    });

    for (const coupon of expiredCoupons) {
      coupon.isValid = false;
      await coupon.save();
    }

    console.log('Expired coupons marked as invalid');
  } catch (error) {
    console.error('Error marking expired coupons:', error);
  }
}

function expireOTP() {
  cron.schedule('*/1 * * * *', markExpiredOTPs);
}
function scheduleCronJob() {
  cron.schedule('0 0 * * *', markExpiredOrders);
  cron.schedule('0 0 * * *', markExpiredCoupons);
}


module.exports = { scheduleCronJob, expireOTP };