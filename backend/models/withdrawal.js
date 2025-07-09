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
    variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
      defaultValue: 'pendiente',
    }
  });

  Withdrawal.associate = models => {
    Withdrawal.belongsTo(models.User, { foreignKey: 'userId' });
    Withdrawal.belongsTo(models.ONG, { foreignKey: 'ongId' });
  };

  return Withdrawal;
};
