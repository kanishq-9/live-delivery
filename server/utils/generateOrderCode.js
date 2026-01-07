const crypto = require("crypto");

const generateOrderCode = function (userId) {
  const prefix = "ORD";
  const timeStamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const randomNumber = crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex")
    .substring(0, 6)
    .toUpperCase();

  return `${prefix}-${timeStamp}-${randomNumber}`;
};

module.exports = { generateOrderCode }
