module.exports = (sequelize, Sequelize, DataTypes) => {
    const Admins = sequelize.define(
      "admins",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(191),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        profile: {
          type: DataTypes.STRING(1000),
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
    return Admins;
  };
  