module.exports = (sequelize, Sequelize, DataTypes) => {
  const UpiRegisters = sequelize.define(
    "upi_registers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      upi_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      barcode_photo: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },     
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
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
  return UpiRegisters;
};
