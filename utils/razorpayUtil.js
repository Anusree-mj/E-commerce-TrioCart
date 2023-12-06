const Razorpay = require('razorpay');
const crypto =  require('crypto');

var instance = new Razorpay({
    key_id: 'rzp_test_mj8FaMjD2VYPW4',
    key_secret: 'bJeiO2GMbp3vvqfvPzwNQUaC'
})

const createRazorpayOrder= async (orderId,total)=>{
const totalAmount= parseInt(total,10)
console.log('typeofamount',typeof(totalAmount))
    const options = {
        amount: totalAmount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: ""+orderId
    };
    try {
        const order = await instance.orders.create(options);
        console.log('razopaycreatedorder',order)
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
        console.log('Payment match');  
        return{status:'ok'}      
      } else{
        console.log('payment doesnt match')
      }
}

module.exports = {
    createRazorpayOrder,
    verifyPayment
  };