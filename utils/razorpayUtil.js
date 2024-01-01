const Razorpay = require('razorpay');
const crypto =  require('crypto');

const instance = new Razorpay({
    key_id: 'rzp_test_mj8FaMjD2VYPW4',
    key_secret: process.env.RazorpayKey_Secret_url
})

const createRazorpayOrder= async (orderId,total)=>{
const totalAmount= parseInt(total,10)
    const options = {
        amount: totalAmount*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: ""+orderId
    };
    try {
        const order = await instance.orders.create(options);
        return order;
      } catch (error) {
        throw error;
      }
}

const verifyPayment= (details)=>{
  const secret = 'bJeiO2GMbp3vvqfvPzwNQUaC';
  const orderId = details.payment.razorpay_order_id;
  const paymentId = details.payment.razorpay_payment_id;
  const razorpaySignature = details.payment.razorpay_signature;

  // Create the hash using the payment information
  const generatedSignature = crypto.createHmac('sha256', secret)
      .update(orderId + "|" + paymentId)
      .digest('hex');
      if (generatedSignature === razorpaySignature) {
        // Payment is successful
        return{status:'ok'}      
      } else{
        console.log('payment doesnt match')
      }
}

module.exports = {
    createRazorpayOrder,
    verifyPayment
  };