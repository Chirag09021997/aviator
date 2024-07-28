module.exports = (sequelize, Sequelize, DataTypes) => {
  const gameStrategy = sequelize.define(
    "game_strategy",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      game_option: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
      },
      position: {
        type: DataTypes.INTEGER,
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
  return gameStrategy;
};
