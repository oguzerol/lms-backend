const db = require("../../src/db");

module.exports = async () => {
  await db.destroy();
};
