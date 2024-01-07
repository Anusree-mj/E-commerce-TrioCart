const userUpdateHelpers = require('../../../helpers/user/userHelpers/userUpdate-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');
const signupUtil = require('../../../utils/signupUtil');
const walletHelpers = require('../../../helpers/user/userHelpers/wallet-helpers')

const getProfilePage = async (req, res, next) => {
  try {
    let sessionId = req.cookies.session;
    let allCategories = await categoryHelpers.getCategoryDetails();

    let result = await sessionHelpers.checkSessions(sessionId);

    if (result.status === 'ok') {
      let user = result.user;
      let userId = result.user._id;

      let cartResult = await cartHelpers.getMyCartProducts(userId);

      if (cartResult) {
        let totalCartProduct = cartResult.totalCount;
        let walletResult = await walletHelpers.getWalletDetails(userId);

        if (walletResult.status === 'ok') {
          const walletDetails = walletResult.walletDetails;
          res.render('customers/customer/profile', {
            layout: 'layout/layout',
            allCategories, user, totalCartProduct, walletDetails
          });
        } else {
          res.render('customers/customer/profile', {
            layout: 'layout/layout',
            allCategories, user, totalCartProduct, walletDetails: undefined
          });
        }
      }
    } else {
      res.redirect('/user/login');
    }
  } catch (error) {
    next(error);
  }
};

const sendUserProfileUpdateRequest = async (req, res, next) => {
  try {    
    let userId = req.params.userId;
    const otp = signupUtil.generateOTP();
    let result = await userUpdateHelpers.verifyUser(req.body, otp, userId);

    if (result.status === 'ok') {
      const tempUserId = result.tempUserId;
      res.status(200).json({ status: "ok", tempUserId });
    } else {
      res.status(400).json({ status: "nok" });
    }
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    let userId = req.body.tempUserId;
    const otp = signupUtil.generateOTP();
    let result = await userUpdateHelpers.resendOtp(otp, userId);

    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    const { otp } = req.body;
    let result = await userUpdateHelpers.updateUser(userId, otp);

    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    let result = await userUpdateHelpers.changePassword(req.body);

    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfilePage,
  sendUserProfileUpdateRequest,
  resendOtp,
  updateProfile,
  changePassword,
}