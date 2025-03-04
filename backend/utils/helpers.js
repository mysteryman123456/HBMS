
const crypto = require("crypto");

// Generate UUID for hotel IDs
const generateUUID = () => {
  const uuid = crypto.randomUUID();
  const alphanumericPart = uuid.replace(/-/g, "");
  return alphanumericPart.slice(0, 10);
};

module.exports = {
  generateUUID
};