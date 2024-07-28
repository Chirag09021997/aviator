module.exports = (sequelize, Sequelize, DataTypes) => {
  const Settings = sequelize.define(
    "settings",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      s_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      s_value: {
        type: DataTypes.DOUBLE,
        allowNull: 0.00,
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
  return Settings;
};
