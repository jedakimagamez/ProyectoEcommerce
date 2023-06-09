const User = require("../models/User");
const sequelize = require("../utils/connection");
require("../models/User");
require("../models/Product");
require("../models/Category");
require("../models/ProductImg");
require("../models/Cart");
require("../models/Purchase");
require("../models");

const main = async () => {
  try {
    await sequelize.sync({ force: true });
    await User.create({
      firstName: "test",
      lastName: "test",
      email: "test@gmail.com",
      password: "test1234",
      phone: "952098208",
    });
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
