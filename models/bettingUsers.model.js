module.exports = (sequelize, Sequelize, DataTypes) => {
  const BettingUsers = sequelize.define(
    "betting_users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      betting_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      out_amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      out_x: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      position: {
        type: DataTypes.INTEGER(1),
        defaultValue: 1,
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
  return BettingUsers;
};
