const cron = require('node-cron');
const collection = require('../models/index-model')

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

  } catch (error) {
    console.log(error);
  }
}

function scheduleCronJob() {
  cron.schedule('0 0 * * *', markExpiredOrders);
}


module.exports = { scheduleCronJob };