module.exports = (sequelize, Sequelize, DataTypes) => {
  const Payments = sequelize.define(
    "payments",
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
      },
      upi_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      photo: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      transaction_no: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Rejected", "Complete"),
        defaultValue: "Pending",
      },
      pay_type: {
        type: DataTypes.ENUM("Withdraw", "Deposit"),
        defaultValue: null,
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
  return Payments;
};
