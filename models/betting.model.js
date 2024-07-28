module.exports = (sequelize, Sequelize, DataTypes) => {
  const Betting = sequelize.define(
    "betting",
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
      out_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      total_user: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },   
      result: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
  return Betting;
};
