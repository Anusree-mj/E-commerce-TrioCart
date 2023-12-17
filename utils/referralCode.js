function generateRandomCharacters(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  
  function generateReferralCode(username) {
    const minRandomChars = 5;
    const randomChars = generateRandomCharacters(minRandomChars);
    const referralCode = username.toUpperCase() + randomChars;
    return referralCode;
  }

  module.exports ={ generateReferralCode};