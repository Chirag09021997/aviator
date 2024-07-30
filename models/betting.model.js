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
      t_users: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      game_strategy_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      result: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
