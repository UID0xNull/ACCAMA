module.exports = (sequelize, DataTypes) => {
  const Withdrawal = sequelize.define('Withdrawal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
  });

  Withdrawal.associate = models => {
    Withdrawal.belongsTo(models.User, { foreignKey: 'userId' });
    Withdrawal.belongsTo(models.ONG, { foreignKey: 'ongId' });
  };

  return Withdrawal;
};
