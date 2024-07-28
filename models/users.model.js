module.exports = (sequelize, Sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      mobile_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      upi_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total_balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      total_deposit: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      total_withdraw: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      total_bet: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      note: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      status: {
        type: DataTypes.ENUM("Block", "Unblock"),
        defaultValue: "Unblock",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Users;
};
