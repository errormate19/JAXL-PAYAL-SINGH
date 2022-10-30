const genrateOTP = () => {
  return {
    otp: Math.floor(Math.random() * 1000000),
    time: new Date().getTime(),
  };
};

module.exports = genrateOTP;
