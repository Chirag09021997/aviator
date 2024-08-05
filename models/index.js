const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    timezone: '+05:30' // Set timezone to Asia/Kolkata (IST)
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.admins = require("./admin.model")(sequelize, Sequelize, DataTypes);
db.users = require("./users.model")(sequelize, Sequelize, DataTypes);
db.upiRegisters = require("./upiRegister.model")(sequelize, Sequelize, DataTypes);
db.betSuggestPlans = require("./betSuggestPlan.model")(sequelize, Sequelize, DataTypes);
db.cashPlans = require("./cashPlan.model")(sequelize, Sequelize, DataTypes);
db.payments = require('./payments.model')(sequelize, Sequelize, DataTypes);
db.betting = require('./betting.model')(sequelize, Sequelize, DataTypes);
db.bettingUser = require('./bettingUsers.model')(sequelize, Sequelize, DataTypes);
db.settings = require('./setting.model')(sequelize, Sequelize, DataTypes);
db.gameStrategy = require('./gameStrategy.model')(sequelize, Sequelize, DataTypes);

//  RelationShip Start
db.betting.hasMany(db.bettingUser, { foreignKey: "betting_id" });
db.bettingUser.belongsTo(db.betting, { foreignKey: "betting_id" });

db.users.hasMany(db.bettingUser, { foreignKey: "user_id" });
db.bettingUser.belongsTo(db.users, { foreignKey: "user_id" });
//  RelationShip End

module.exports = db;
