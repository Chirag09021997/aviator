module.exports = (sequelize, Sequelize, DataTypes) => {
  const CashPlan = sequelize.define(
    "cash_plans",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },     
      bonus_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
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
  return CashPlan;
};
