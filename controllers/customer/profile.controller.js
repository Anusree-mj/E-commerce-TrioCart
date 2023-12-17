const userUpdateHelpers = require('../../helpers/user/userUpdate-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');
const signupUtil = require('../../utils/signupUtil');


const getProfilePage = async (req, res, next) => {
  let sessionId = req.cookies.session
  let allCategories = await categoryHelpers.getCategoryDetails()

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user

      let userId = result.user._id
      cartHelpers.getMyCartProducts(userId).then((result) => {
        if (result) {
          let totalCartProduct = result.totalCount;
          res.render('customers/customer/profile', { layout: 'layout/layout', allCategories, user: user, totalCartProduct });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  });
}

const sendUserProfileUpdateRequest = (req, res, next) => {
  console.log('entered in senduserprodfileupdate')
  let userId = req.params.userId;
  const otp = signupUtil.generateOTP();
  userUpdateHelpers.verifyUser(req.body, otp, userId).then((result) => {
    if (result.status === 'ok') {
      const tempUserId = result.tempUserId
      console.log(tempUserId,'gsdjkjgew')
      res.status(200).json({ status: "ok",tempUserId });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
}

const resendOtp = (req, res, next) => {
  let userId = req.body.tempUserId;
  const otp = signupUtil.generateOTP();
  userUpdateHelpers.resendOtp( otp, userId).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
}

const updateProfile = async (req, res, next) => {
  let userId = req.params.userId;
  const {otp}=req.body;
  userUpdateHelpers.updateUser(userId, otp).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
}

const changePassword = async (req, res, next) => {
  userUpdateHelpers.changePassword(req.body).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
}

module.exports = {
  getProfilePage,
  sendUserProfileUpdateRequest,
  resendOtp,
  updateProfile,
  changePassword,
}